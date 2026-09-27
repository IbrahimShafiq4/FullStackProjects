import {
  Component, effect, ElementRef, inject, Injector, OnDestroy, OnInit,
  runInInjectionContext, signal, Signal, viewChild, WritableSignal
} from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveClassService } from '../../../core/services/live-class.service';
import { LiveSessionsService } from '../../../core/services/live-sessions.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../src/environments';
import { ILiveSessionDetail } from '../../../core/models';

interface IPendingDraw {
  x: number;
  y: number;
  isNewStroke: boolean;
}

@Component({
  imports: [],
  selector: 'app-live-room',
  styleUrl: './live-room.css',
  templateUrl: './live-room.html',
})
export class LiveRoom implements OnInit, OnDestroy {
  public readonly _LiveClass: LiveClassService = inject(LiveClassService);
  public readonly _LiveSessionsService: LiveSessionsService = inject(LiveSessionsService);
  public readonly _AuthService: AuthService = inject(AuthService);
  private readonly _HttpClient: HttpClient = inject(HttpClient);
  private readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router: Router = inject(Router);
  private readonly _Injector: Injector = inject(Injector);

  private readonly _LocalVideoRef: Signal<ElementRef<HTMLVideoElement> | undefined> = viewChild<ElementRef<HTMLVideoElement>>('localVideo');
  private readonly _CanvasRef: Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('whiteboard');

  private _CanvasCtx: CanvasRenderingContext2D | null = null;
  private _IsDrawing: boolean = false;
  private _TimerInterval: ReturnType<typeof setInterval> | null = null;
  private _MediaRecorder: MediaRecorder | null = null;
  private _RecordedChunks: Blob[] = [];
  private _DrawHandlerRegistered: boolean = false;
  private _PendingDraws: IPendingDraw[] = [];

  public sessionId: number = 0;
  public sessionDetail: WritableSignal<ILiveSessionDetail | null> = signal<ILiveSessionDetail | null>(null);
  public newChatMessage: WritableSignal<string> = signal<string>('');
  public isInstructor: WritableSignal<boolean> = signal<boolean>(false);
  public isMuted: WritableSignal<boolean> = signal<boolean>(false);
  public isCameraOff: WritableSignal<boolean> = signal<boolean>(false);
  public isHandRaised: WritableSignal<boolean> = signal<boolean>(false);
  public showSettings: WritableSignal<boolean> = signal<boolean>(false);
  public showSidebar: WritableSignal<boolean> = signal<boolean>(true);
  public layoutMode: WritableSignal<'split' | 'video' | 'board'> = signal<'split' | 'video' | 'board'>('split');
  public elapsedSeconds: WritableSignal<number> = signal<number>(0);
  public micDevices: WritableSignal<MediaDeviceInfo[]> = signal<MediaDeviceInfo[]>([]);
  public cameraDevices: WritableSignal<MediaDeviceInfo[]> = signal<MediaDeviceInfo[]>([]);
  public selectedMic: WritableSignal<string> = signal<string>('');
  public selectedCamera: WritableSignal<string> = signal<string>('');

  public isRecording: WritableSignal<boolean> = signal<boolean>(false);
  public showSaveModal: WritableSignal<boolean> = signal<boolean>(false);
  public recordingTitle: WritableSignal<string> = signal<string>('');
  public isUploading: WritableSignal<boolean> = signal<boolean>(false);
  public uploadProgress: WritableSignal<number> = signal<number>(0);

  public waitingForApproval: WritableSignal<boolean> = signal<boolean>(false);
  public joinRejected: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    effect(() => {
      const streams: Map<string, MediaStream> = this._LiveClass.remoteStreams();
      streams.forEach((stream: MediaStream, connectionId: string) => {
        const videoElement = document.getElementById(`remote-${connectionId}`) as HTMLVideoElement;
        if (videoElement && videoElement.srcObject !== stream) {
          videoElement.srcObject = stream;
        }
      });
    });

    effect(() => {
      const sharing: boolean = this._LiveClass.isScreenSharing();
      const localVideo = this._LocalVideoRef()?.nativeElement;
      if (!localVideo) return;

      const targetStream = sharing ? this._LiveClass.screenStream : this._LiveClass.localStream;
      if (targetStream && localVideo.srcObject !== targetStream) {
        localVideo.srcObject = targetStream;
      }
    });

    effect(() => {
      const ended: boolean = this._LiveClass.sessionEnded();
      if (ended) {
        if (this._LiveClass.isJoinRejected()) {
          this.joinRejected.set(true);
          this._ToastService.show('المدرس رفض طلب الانضمام', 'error');
        } else {
          this._ToastService.show('انتهت الحصة', 'info');
        }
        this._LiveClass.disconnect();
        this._Router.navigate(['/courses']);
      }
    });
  }

  public async ngOnInit(): Promise<void> {
    this.sessionId = Number(this._Route.snapshot.paramMap.get('id'));
    this.isInstructor.set(this._AuthService.isInstructor());

    const userName: string = this._AuthService.currentUser()?.fullName ?? 'مستخدم';

    this._LiveSessionsService.getSession(this.sessionId).subscribe({
      next: (data: ILiveSessionDetail) => {
        this.sessionDetail.set(data);
        this.recordingTitle.set(data.title);
      }
    });

    try {
      await this._LiveClass.startCamera();
    } catch {
      this._ToastService.show('تعذر الوصول للكاميرا أو الميكروفون', 'error');
    }

    if (this.isInstructor()) {
      this.isMuted.set(false);
      this.isCameraOff.set(false);
      this._LiveClass.toggleLocalAudio(true);
      this._LiveClass.toggleLocalVideo(true);
    } else {
      this.isMuted.set(true);
      this.isCameraOff.set(true);
      this._LiveClass.toggleLocalAudio(false);
      this._LiveClass.toggleLocalVideo(false);
      this.waitingForApproval.set(true);
    }

    const localVideo = this._LocalVideoRef()?.nativeElement;
    if (localVideo) localVideo.srcObject = this._LiveClass.localStream;

    localStorage.setItem('pendingUserName', userName);
    localStorage.setItem('pendingIsInstructor', String(this.isInstructor()));

    await this._LiveClass.connect(this.sessionId, userName, this.isInstructor());

    runInInjectionContext(this._Injector, () => {
      effect(() => {
        const participants = this._LiveClass.participants();
        if (participants.length > 0 || this.isInstructor()) {
          this.waitingForApproval.set(false);
        }
      });
    });

    this._SetupWhiteboard();
    this._StartTimer();

    if (this.isInstructor()) {
      setTimeout(() => {
        this._StartRecording();
      }, 1000);
    }

    await this._LoadDevices();

    this._LiveClass.toggleCameraBroadcast(this.sessionId, this.isCameraOff());
  }

  public onApproveJoin(connectionId: string): void {
    this._LiveClass.approveJoin(this.sessionId, connectionId);
  }

  public onRejectJoin(connectionId: string): void {
    this._LiveClass.rejectJoin(this.sessionId, connectionId);
  }

  public onApproveAll(): void {
    this._LiveClass.approveAll(this.sessionId);
  }

  public onRejectAll(): void {
    this._LiveClass.rejectAll(this.sessionId);
  }

  private _StartTimer(): void {
    this._TimerInterval = setInterval(() => {
      this.elapsedSeconds.update((v: number) => v + 1);
    }, 1000);
  }

  public formattedDuration(): string {
    const total = this.elapsedSeconds();
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number): string => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  private _StartRecording(): void {
    const stream = this._LiveClass.localStream;
    if (!stream) {
      this.isRecording.set(false);
      this._ToastService.show('تعذر بدء التسجيل — الكاميرا مش شغالة', 'error');
      return;
    }

    try {
      let mimeType: string = 'video/webm';

      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          mimeType = 'video/webm;codecs=vp9,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
          mimeType = 'video/webm;codecs=vp8,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          mimeType = 'video/webm;codecs=vp8';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        }
      }

      this._MediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      });

      this._RecordedChunks = [];

      this._MediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this._RecordedChunks.push(event.data);
        }
      };

      this._MediaRecorder.onerror = () => {
        this._ToastService.show('حصل خطأ في التسجيل', 'error');
        this.isRecording.set(false);
      };

      this._MediaRecorder.start(1000);
      this.isRecording.set(true);
    } catch {
      this.isRecording.set(false);
      this._ToastService.show('المتصفح مش بيدعم التسجيل', 'error');
    }
  }

  private _StopRecording(): Promise<Blob> {
    return new Promise<Blob>((resolve) => {
      if (!this._MediaRecorder) {
        return resolve(new Blob());
      }

      if (this._MediaRecorder.state === 'inactive') {
        const blob = new Blob(this._RecordedChunks, { type: 'video/webm' });
        this.isRecording.set(false);
        return resolve(blob);
      }

      const timeout = setTimeout(() => {
        const blob = new Blob(this._RecordedChunks, { type: 'video/webm' });
        this.isRecording.set(false);
        resolve(blob);
      }, 3000);

      this._MediaRecorder.onstop = () => {
        clearTimeout(timeout);
        const blob = new Blob(this._RecordedChunks, { type: 'video/webm' });
        this.isRecording.set(false);
        resolve(blob);
      };

      try {
        if (this._MediaRecorder.state === 'recording') {
          this._MediaRecorder.requestData();
        }
      } catch { }

      setTimeout(() => {
        try {
          if (this._MediaRecorder && this._MediaRecorder.state !== 'inactive') {
            this._MediaRecorder.stop();
          }
        } catch { }
      }, 200);
    });
  }

  private async _LoadDevices(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.micDevices.set(devices.filter((d) => d.kind === 'audioinput'));
      this.cameraDevices.set(devices.filter((d) => d.kind === 'videoinput'));
    } catch {
      this.micDevices.set([]);
      this.cameraDevices.set([]);
    }
  }

  private _SetupWhiteboard(): void {
    const canvas = this._CanvasRef()?.nativeElement;
    if (!canvas) return;

    this._CanvasCtx = canvas.getContext('2d');
    if (this._CanvasCtx) {
      this._CanvasCtx.strokeStyle = '#7C3AED';
      this._CanvasCtx.lineWidth = 3;
      this._CanvasCtx.lineCap = 'round';
    }

    if (!this._DrawHandlerRegistered) {
      this._LiveClass._HubConnection?.on('DrawEvent', (x: number, y: number, isNewStroke: boolean) => {
        this._DrawPoint(x, y, isNewStroke);
      });

      this._LiveClass._HubConnection?.on('WhiteboardCleared', () => this._ClearCanvasLocally());
      this._DrawHandlerRegistered = true;
    }

    if (this._PendingDraws.length > 0) {
      const pending = [...this._PendingDraws];
      this._PendingDraws = [];
      pending.forEach((d: IPendingDraw) => this._DrawPoint(d.x, d.y, d.isNewStroke));
    }
  }

  public onCanvasMouseDown(event: MouseEvent): void {
    if (!this.isInstructor()) return;
    this._IsDrawing = true;
    const { x, y }: { x: number; y: number } = this._GetCanvasCoords(event);
    this._DrawPoint(x, y, true);
    this._LiveClass.sendDrawEvent(this.sessionId, x, y, true);
  }

  public onCanvasMouseMove(event: MouseEvent): void {
    if (!this.isInstructor()) return;
    if (!this._IsDrawing) return;
    const { x, y }: { x: number; y: number } = this._GetCanvasCoords(event);
    this._DrawPoint(x, y, false);
    this._LiveClass.sendDrawEvent(this.sessionId, x, y, false);
  }

  public onCanvasMouseUp(): void {
    this._IsDrawing = false;
  }

  private _GetCanvasCoords(event: MouseEvent): { x: number; y: number } {
    const canvas = this._CanvasRef()!.nativeElement;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  private _DrawPoint(x: number, y: number, isNewStroke: boolean): void {
    if (!this._CanvasCtx) {
      this._PendingDraws.push({ x, y, isNewStroke });
      return;
    }

    if (isNewStroke) {
      this._CanvasCtx.beginPath();
      this._CanvasCtx.moveTo(x, y);
    } else {
      this._CanvasCtx.lineTo(x, y);
      this._CanvasCtx.stroke();
    }
  }

  private _ClearCanvasLocally(): void {
    const canvas = this._CanvasRef()?.nativeElement;
    if (canvas && this._CanvasCtx) {
      this._CanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this._PendingDraws = [];
  }

  public onClearWhiteboad(): void {
    if (!this.isInstructor()) {
      this._ToastService.show('السبورة للمدرس بس', 'error');
      return;
    }
    this._ClearCanvasLocally();
    this._LiveClass.clearWhiteboard(this.sessionId);
  }

  public onSendMessage(): void {
    if (!this.newChatMessage().trim()) return;
    const userName: string = this._AuthService.currentUser()?.fullName ?? 'أنا';
    this._LiveClass.sendChatMessage(this.sessionId, userName, this.newChatMessage());
    this.newChatMessage.set('');
  }

  public onRaiseHand(): void {
    if (this.isHandRaised()) return;
    const userName: string = this._AuthService.currentUser()?.fullName ?? 'أنا';
    this._LiveClass.raiseHand(this.sessionId, userName);
    this.isHandRaised.set(true);
    this._ToastService.show('تم إرسال طلب رفع اليد', 'info');
  }

  public onLowerHand(): void {
    if (!this.isHandRaised()) return;
    const userName: string = this._AuthService.currentUser()?.fullName ?? 'أنا';
    this._LiveClass.lowerHand(this.sessionId, userName);
    this.isHandRaised.set(false);
    this._ToastService.show('تم إنزال إيدك', 'info');
  }

  public onApproveHand(connectionId: string): void {
    this._LiveClass.approvedHand(this.sessionId, connectionId);
  }

  public async onToggleScreenShare(): Promise<void> {
    if (this._LiveClass.isScreenSharing()) {
      await this._LiveClass.stopScreenShar(this.sessionId);
    } else {
      try {
        await this._LiveClass.startScreenShare(this.sessionId);
      } catch {
        this._ToastService.show('تعذر مشاركة الشاشة', 'error');
      }
    }
  }

  public toggleMute(): void {
    this.isMuted.update((value: boolean) => !value);
    this._LiveClass.toggleLocalAudio(!this.isMuted());
  }

  public toggleCamera(): void {
    this.isCameraOff.update((value: boolean) => !value);
    this._LiveClass.toggleLocalVideo(!this.isCameraOff());
    this._LiveClass.toggleCameraBroadcast(this.sessionId, this.isCameraOff());
  }

  public toggleSidebar(): void {
    this.showSidebar.update((v: boolean) => !v);
  }

  public setLayout(mode: 'split' | 'video' | 'board'): void {
    this.layoutMode.set(mode);
    setTimeout(() => this._SetupWhiteboard(), 50);
  }

  public onOpenSettings(): void {
    this.showSettings.set(true);
    this._LoadDevices();
  }

  public onCloseSettings(): void {
    this.showSettings.set(false);
  }

  public async onSwitchMic(deviceId: string): Promise<void> {
    this.selectedMic.set(deviceId);
    await this._RestartStream();
  }

  public async onSwitchCamera(deviceId: string): Promise<void> {
    this.selectedCamera.set(deviceId);
    await this._RestartStream();
  }

  private async _RestartStream(): Promise<void> {
    this._LiveClass.localStream?.getTracks().forEach((t: MediaStreamTrack) => t.stop());

    try {
      const constraints: MediaStreamConstraints = {
        audio: this.selectedMic() ? { deviceId: { exact: this.selectedMic() } } : true,
        video: this.selectedCamera() ? { deviceId: { exact: this.selectedCamera() } } : true
      };
      this._LiveClass.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      this._LiveClass.localStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !this.isMuted();
      });
      this._LiveClass.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !this.isCameraOff();
      });

      if (!this._LiveClass.isScreenSharing()) {
        const localVideo = this._LocalVideoRef()?.nativeElement;
        if (localVideo) localVideo.srcObject = this._LiveClass.localStream;
      }
    } catch {
      this._ToastService.show('تعذر تبديل الجهاز', 'error');
    }
  }

  public onExit(): void {
    this._LiveClass.disconnect();
    this._Router.navigate(['/courses']);
  }

  public onEndLive(): void {
    if (!this.isInstructor()) {
      this._LiveClass.disconnect();
      this._Router.navigate(['/courses']);
      return;
    }

    this.showSaveModal.set(true);
  }

  public onSkipSave(): void {
    this.showSaveModal.set(false);
    this._FinalizeEnd();
  }

  public async onSaveRecording(): Promise<void> {
    const title: string = this.recordingTitle().trim();
    if (!title) {
      this._ToastService.show('اكتب اسم للحصة الأول', 'error');
      return;
    }

    const session = this.sessionDetail();
    if (!session) {
      this._ToastService.show('تعذر جلب بيانات الجلسة', 'error');
      return;
    }

    this.isUploading.set(true);
    this.uploadProgress.set(10);

    let blob: Blob;
    try {
      blob = await this._StopRecording();
    } catch {
      this.isUploading.set(false);
      this._ToastService.show('فشل إيقاف التسجيل', 'error');
      this.showSaveModal.set(false);
      this._FinalizeEnd();
      return;
    }

    this.uploadProgress.set(30);

    if (!blob || blob.size === 0) {
      this.isUploading.set(false);
      this._ToastService.show('مفيش تسجيل محفوظ — سيب الحصة شغالة شوية تاني', 'error');
      this.showSaveModal.set(false);
      this._FinalizeEnd();
      return;
    }

    this.uploadProgress.set(40);

    const extension: string = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const fileName: string = `live-${this.sessionId}-${Date.now()}.${extension}`;
    const formData: FormData = new FormData();

    formData.append('title', title);
    formData.append('order', '999');
    formData.append('file', blob, fileName);

    const uploadUrl: string = `${environment.apiUrl}/api/videos/course/${session.courseId}`;

    this._HttpClient.post<{ id: number }>(uploadUrl, formData, {
      withCredentials: true,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: HttpEvent<{ id: number }>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          this.uploadProgress.set(40 + Math.round(percent * 0.6));
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress.set(100);
          this.isUploading.set(false);
          this._ToastService.show('تم حفظ الحصة في الكورس', 'success');
          this.showSaveModal.set(false);
          this._FinalizeEnd();
        }
      },
      error: (err) => {
        this.isUploading.set(false);
        let msg = 'فشل رفع التسجيل';
        if (err?.status === 401) msg = 'الجلسة انتهت — سجّل دخول تاني';
        else if (err?.status === 403) msg = 'مش مسموح لك ترفع في الكورس ده';
        else if (err?.status === 413) msg = 'حجم الفيديو أكبر من الحد المسموح';
        else if (err?.status === 404) msg = 'الكورس مش موجود';
        else if (err?.status) msg = `فشل الرفع (كود ${err.status})`;

        this._ToastService.show(msg, 'error');
        this.showSaveModal.set(false);
        this._FinalizeEnd();
      }
    });
  }

  private _FinalizeEnd(): void {
    this._LiveClass.endSession(this.sessionId);

    this._LiveSessionsService.endSession(this.sessionId).subscribe({
      next: () => {
        this._ToastService.show('تم إنهاء الحصة', 'success');
        setTimeout(() => {
          this._LiveClass.disconnect();
          this._Router.navigate(['/courses']);
        }, 500);
      },
      error: () => {
        this._LiveClass.disconnect();
        this._Router.navigate(['/courses']);
      }
    });
  }

  public getRemoveConnectionIds(): string[] {
    return this._LiveClass.participants().map((p) => p.connectionId);
  }

  public getInitial(name: string): string {
    if (!name) return '؟';
    return name.trim().charAt(0);
  }

  public getAvatarColor(name: string): string {
    const palettes: string[] = [
      'linear-gradient(135deg, #d4a017 0%, #8b6a0f 100%)',
      'linear-gradient(135deg, #4a5c4e 0%, #2a3a2e 100%)',
      'linear-gradient(135deg, #5f3d1c 0%, #3d2612 100%)',
      'linear-gradient(135deg, #3d5a80 0%, #1e3a5c 100%)',
      'linear-gradient(135deg, #7a3d5c 0%, #4a1e3a 100%)',
      'linear-gradient(135deg, #4a7a2a 0%, #2a5018 100%)'
    ];

    if (!name) return palettes[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return palettes[Math.abs(hash) % palettes.length];
  }

  public ngOnDestroy(): void {
    if (this._TimerInterval) {
      clearInterval(this._TimerInterval);
      this._TimerInterval = null;
    }

    if (this._MediaRecorder && this._MediaRecorder.state !== 'inactive') {
      try {
        this._MediaRecorder.stop();
      } catch { }
    }

    localStorage.removeItem('pendingUserName');
    localStorage.removeItem('pendingIsInstructor');
    this._LiveClass.disconnect();
  }
}