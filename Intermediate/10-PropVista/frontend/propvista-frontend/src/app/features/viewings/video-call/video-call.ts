import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';
import { VideoCallService } from '../../../core/services/video-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-video-call',
  templateUrl: './video-call.html',
})
export class VideoCall implements OnInit, OnDestroy {
  public _VideoCallService = inject(VideoCallService);

  private _ActivatedRoute = inject(ActivatedRoute);
  private _AuthService = inject(AuthService);
  private _ToastService = inject(ToastService);
  private _Router = inject(Router);
  private _NotificationService = inject(NotificationService);

  private localVideoRef =
    viewChild<ElementRef<HTMLVideoElement>>('localVideo');

  private remoteVideoRef =
    viewChild<ElementRef<HTMLVideoElement>>('remoteVideo');

  constructor() {
    effect(() => {
      const stream = this._VideoCallService.localVideoStream();
      const videoEl = this.localVideoRef()?.nativeElement;

      if (stream && videoEl) {
        videoEl.srcObject = stream;
      }
    });

    effect(() => {
      const stream = this._VideoCallService.remoteVideoStream();
      const videoEl = this.remoteVideoRef()?.nativeElement;

      if (stream && videoEl) {
        videoEl.srcObject = stream;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const viewingId = Number(
      this._ActivatedRoute.snapshot.paramMap.get('id')
    );

    if (!viewingId) {
      this._ToastService.show(
        'معرف المعاينة غير صالح',
        'error'
      );

      this._Router.navigate(['/']);
      return;
    }

    const user = this._AuthService.currentUser();

    if (!user) {
      this._ToastService.show(
        'يجب تسجيل الدخول',
        'error'
      );

      this._Router.navigate(['/login']);
      return;
    }

    try {
      // الباحث يرسل Notification للمالك أولاً
      if (user.role === 'Seeker') {
        console.log('📞 Sending video call notification...');

        await firstValueFrom(
          this._NotificationService.requestVideoCall(viewingId)
        );

        console.log('✅ Video call notification sent');

        this._ToastService.show(
          'تم إرسال طلب المعاينة للمالك، في انتظار قبوله...',
          'info'
        );
      }

      // بعد ذلك يدخل غرفة الفيديو
      await this._VideoCallService.connectSignaling(
        viewingId,
        user.role
      );

    } catch (error) {
      console.error('Video call initialization error:', error);

      this._ToastService.show(
        'حدث خطأ أثناء بدء المكالمة',
        'error'
      );
    }
  }

  async endCall() {
    await this._VideoCallService.endCall();
    this._Router.navigate(['/']);
  }

  async ngOnDestroy(): Promise<void> {
    await this._VideoCallService.endCall();
  }
}