import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CoursesService } from '../../../core/services/courses.service';
import { StudyFilesService } from '../../../core/services/study-files.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { LiveSessionsService } from '../../../core/services/live-sessions.service';
import { VideosService } from '../../../core/services/videos.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ICourse,
  IReview,
  IRatingSummary,
  IStudyFile,
  ILiveSession,
  IVideo,
  IPayment
} from '../../../core/models';
import { PdfPreviewer } from '../../../shared/components/pdf-previewer/pdf-previewer/pdf-previewer';
import { VideoPlayer } from '../../videos/video-player/video-player';

@Component({
  selector: 'app-course-detail',
  imports: [RouterLink, VideoPlayer, PdfPreviewer, FormsModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetail implements OnInit {
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _StudyFilesService: StudyFilesService = inject(StudyFilesService);
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _ReviewsService: ReviewsService = inject(ReviewsService);
  public readonly _LiveSessionsService: LiveSessionsService = inject(LiveSessionsService);
  public readonly _VideosService: VideosService = inject(VideosService);
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router: Router = inject(Router);

  public courseId: number = 0;
  public course: WritableSignal<ICourse | null> = signal<ICourse | null>(null);
  public files: WritableSignal<IStudyFile[]> = signal<IStudyFile[]>([]);
  public videos: WritableSignal<IVideo[]> = signal<IVideo[]>([]);
  public reviews: WritableSignal<IReview[]> = signal<IReview[]>([]);
  public liveSessions: WritableSignal<ILiveSession[]> = signal<ILiveSession[]>([]);
  public summary: WritableSignal<IRatingSummary> = signal<IRatingSummary>({ averageRating: 0, totalReviews: 0 });

  public hasPurchased: WritableSignal<boolean> = signal<boolean>(false);
  public purchasedFileIds: WritableSignal<Set<number>> = signal<Set<number>>(new Set<number>());

  public canReview: WritableSignal<boolean> = signal<boolean>(false);
  public alreadyReviewed: WritableSignal<boolean> = signal<boolean>(false);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public isBuying: WritableSignal<boolean> = signal<boolean>(false);
  public isStartingLive: WritableSignal<boolean> = signal<boolean>(false);

  public selectedVideoId: WritableSignal<number | null> = signal<number | null>(null);
  public selectedPdfId: WritableSignal<number | null> = signal<number | null>(null);
  public selectedPdfTitle: WritableSignal<string> = signal<string>('');

  public showVideoUpload: WritableSignal<boolean> = signal<boolean>(false);
  public isUploadingVideo: WritableSignal<boolean> = signal<boolean>(false);
  public videoUploadProgress: WritableSignal<number> = signal<number>(0);
  public newVideoTitle: string = '';
  public selectedVideoFile: File | null = null;

  public showReviewForm: WritableSignal<boolean> = signal<boolean>(false);
  public isSubmittingReview: WritableSignal<boolean> = signal<boolean>(false);
  public reviewRating: number = 5;
  public reviewComment: string = '';

  public ngOnInit(): void {
    this.courseId = Number(this._Route.snapshot.paramMap.get('id'));
    this._loadCourse();
    this._loadFiles();
    this._loadVideos();
    this._loadReviews();
    this._loadLiveSessions();
    this._loadPurchaseState();
    this._checkCanReview();
  }

  private _loadCourse(): void {
    this._CoursesService.getCourse(this.courseId).subscribe({
      next: (data: ICourse) => {
        this.course.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('الكورس غير موجود', 'error');
      }
    });
  }

  private _loadFiles(): void {
    this._StudyFilesService.getFilesByCourse(this.courseId).subscribe({
      next: (data: IStudyFile[]) => this.files.set(data)
    });
  }

  private _loadVideos(): void {
    this._VideosService.getCourseVideos(this.courseId).subscribe({
      next: (data: IVideo[]) => {
        this.videos.set(data);
        if (data.length > 0 && this.selectedVideoId() === null) {
          this.selectedVideoId.set(data[0].id);
        }
      }
    });
  }

  private _loadReviews(): void {
    this._ReviewsService.getReviewsForTarget(2, this.courseId).subscribe({
      next: (data: IReview[]) => this.reviews.set(data)
    });
    this._ReviewsService.getRatingSummary(2, this.courseId).subscribe({
      next: (data: IRatingSummary) => this.summary.set(data)
    });
  }

  private _loadLiveSessions(): void {
    this._LiveSessionsService.getCourseSessions(this.courseId).subscribe({
      next: (data: ILiveSession[]) => this.liveSessions.set(data)
    });
  }

  private _loadPurchaseState(): void {
    if (this._AuthService.isInstructor()) {
      this.hasPurchased.set(true);
      return;
    }

    if (!this._AuthService.currentUser()) {
      return;
    }

    this._PaymentsService.getMyPayments().subscribe({
      next: (payments: IPayment[]) => {
        const succeeded: IPayment[] = payments.filter((p: IPayment) => p.status === 2);

        const coursePurchased: boolean = succeeded.some(
          (p: IPayment) => p.purpose === 2 && p.courseTitle === this.course()?.title
        );
        this.hasPurchased.set(coursePurchased);

        const fileIds: Set<number> = new Set<number>();
        succeeded
          .filter((p: IPayment) => p.purpose === 3 && p.studyFileName)
          .forEach((p: IPayment) => {
            const file = this.files().find((f: IStudyFile) => f.title === p.studyFileName);
            if (file) {
              fileIds.add(file.id);
            }
          });

        this.purchasedFileIds.set(fileIds);
      }
    });
  }

  private _checkCanReview(): void {
    if (this._AuthService.isInstructor()) {
      this.canReview.set(false);
      return;
    }

    if (!this._AuthService.currentUser()) {
      this.canReview.set(false);
      return;
    }

    this._ReviewsService.canReview(2, this.courseId).subscribe({
      next: (res) => {
        this.canReview.set(res.canReview);
        this.alreadyReviewed.set(res.alreadyReviewed);
      },
      error: () => this.canReview.set(false)
    });
  }

  public getVideoTitle(videoId: number): string {
    const video = this.videos().find((v: IVideo) => v.id === videoId);
    return video?.title ?? 'درس فيديو';
  }

  public hasAccessToFile(file: IStudyFile): boolean {
    if (this._AuthService.isInstructor()) return true;
    if (file.isFree) return true;
    if (this.purchasedFileIds().has(file.id)) return true;
    return false;
  }

  public hasAccessToVideo(): boolean {
    if (this._AuthService.isInstructor()) return true;
    return this.hasPurchased();
  }

  public onSelectRating(rating: number): void {
    this.reviewRating = rating;
  }

  public onSubmitReview(): void {
    if (!this.reviewComment.trim()) {
      this._ToastService.show('اكتب تعليقك الأول', 'error');
      return;
    }

    this.isSubmittingReview.set(true);

    this._ReviewsService.createReview({
      targetType: 2,
      targetId: this.courseId,
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.showReviewForm.set(false);
        this.reviewComment = '';
        this.reviewRating = 5;
        this._ToastService.show('تم إضافة تقييمك، شكرًا لك', 'success');
        this._loadReviews();
        this._checkCanReview();
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        const msg = err?.error?.message ?? 'فشل إرسال التقييم';
        this._ToastService.show(msg, 'error');
      }
    });
  }

  public getActiveSession(): ILiveSession | null {
    return this.liveSessions().find((s: ILiveSession) => s.status === 'Live') ?? null;
  }

  public onSelectVideo(videoId: number): void {
    this.selectedVideoId.set(videoId);
    this.selectedPdfId.set(null);
  }

  public onPreviewPdf(file: IStudyFile): void {
    this.selectedPdfId.set(file.id);
    this.selectedPdfTitle.set(file.title);
    this.selectedVideoId.set(null);
  }

  public isPdf(file: IStudyFile): boolean {
    return file.originalFileName.toLowerCase().endsWith('.pdf');
  }

  public onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedVideoFile = input.files[0];
    }
  }

  public onUploadVideo(): void {
    if (!this.newVideoTitle.trim()) {
      this._ToastService.show('اكتب اسم الفيديو', 'error');
      return;
    }

    if (!this.selectedVideoFile) {
      this._ToastService.show('اختار ملف الفيديو', 'error');
      return;
    }

    this.isUploadingVideo.set(true);
    this.videoUploadProgress.set(0);

    const nextOrder: number = this.videos().length + 1;

    this._VideosService.uploadVideoWithProgress(
      this.courseId,
      this.newVideoTitle,
      nextOrder,
      this.selectedVideoFile
    ).subscribe({
      next: (event: HttpEvent<{ id: number }>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent: number = Math.round((event.loaded / event.total) * 100);
          this.videoUploadProgress.set(percent);
        } else if (event.type === HttpEventType.Response) {
          this.isUploadingVideo.set(false);
          this.showVideoUpload.set(false);
          this.newVideoTitle = '';
          this.selectedVideoFile = null;
          this.videoUploadProgress.set(0);
          this._ToastService.show('تم رفع الفيديو', 'success');
          this._loadVideos();
          this._loadCourse();
        }
      },
      error: (err) => {
        this.isUploadingVideo.set(false);
        const statusText: string = err?.status ? `HTTP ${err.status}` : 'شبكة';
        this._ToastService.show(`فشل الرفع: ${statusText}`, 'error');
      }
    });
  }

  public onCancelVideoUpload(): void {
    this.showVideoUpload.set(false);
    this.newVideoTitle = '';
    this.selectedVideoFile = null;
    this.videoUploadProgress.set(0);
  }

  public onStartLive(): void {
    if (this.isStartingLive()) return;
    this.isStartingLive.set(true);

    const course = this.course();
    const title: string = course ? `حصة مباشرة — ${course.title}` : 'حصة مباشرة';

    this._LiveSessionsService.createSession({ courseId: this.courseId, title }).subscribe({
      next: (res) => {
        this.isStartingLive.set(false);
        this._ToastService.show('بدأت الحصة — جاري فتح الفصل اللايف', 'success');
        this._Router.navigate(['/live', res.id]);
      },
      error: () => {
        this.isStartingLive.set(false);
        this._ToastService.show('تعذر بدء الحصة', 'error');
      }
    });
  }

  public onJoinLive(sessionId: number): void {
    this._Router.navigate(['/live', sessionId]);
  }

  public onBuyCourse(): void {
    if (this.isBuying()) return;
    this.isBuying.set(true);

    this._PaymentsService.checkout({ purpose: 2, courseId: this.courseId, studyFileId: null }).subscribe({
      next: (res) => {
        this.isBuying.set(false);
        this._Router.navigate(['/checkout', res.paymentId]);
      },
      error: () => {
        this.isBuying.set(false);
        this._ToastService.show('تعذر بدء عملية الشراء', 'error');
      }
    });
  }

  public onBuyFile(fileId: number): void {
    if (this.isBuying()) return;
    this.isBuying.set(true);

    this._PaymentsService.checkout({ purpose: 3, courseId: null, studyFileId: fileId }).subscribe({
      next: (res) => {
        this.isBuying.set(false);
        this._Router.navigate(['/checkout', res.paymentId]);
      },
      error: () => {
        this.isBuying.set(false);
        this._ToastService.show('تعذر بدء عملية الشراء', 'error');
      }
    });
  }

  public onDownloadFile(fileId: number): void {
    this._StudyFilesService.download(fileId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `study-file-${fileId}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this._ToastService.show('مش مسموح بتحميل الملف ده', 'error')
    });
  }
}