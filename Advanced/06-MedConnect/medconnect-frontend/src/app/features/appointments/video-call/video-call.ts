import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { ToastService } from '../../../shared/services/toast.service';
import { AppointmentsService, IAppointment } from '../../../core/services/appointments.service';

@Component({
  selector: 'app-video-call',
  imports: [],
  templateUrl: './video-call.html',
  styleUrl: './video-call.css',
})
export class VideoCall implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _appointments = inject(AppointmentsService);

  private hub: signalR.HubConnection | null = null;
  private peer: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;

  localVideo = viewChild<ElementRef<HTMLVideoElement>>('localVideo');
  remoteVideo = viewChild<ElementRef<HTMLVideoElement>>('remoteVideo');

  connected = signal(false);
  connecting = signal(true);
  micOn = signal(true);
  camOn = signal(false);
  hasVideo = signal(false);
  hasAudio = signal(false);
  appointmentId = signal<string | null>(null);
  appointment = signal<IAppointment | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      this._router.navigate(['/']);
      return;
    }
    this.appointmentId.set(id);

    this._appointments.loadMyAppointments();

    const found = this._appointments.appointments().find((a) => a.id === Number(id));
    if (found) this.appointment.set(found);

    await this.acquireMedia();
    if (!this.localStream) return;

    const localEl = this.localVideo()?.nativeElement;
    if (localEl) localEl.srcObject = this.localStream;

    await this.setupPeer();
    await this.setupHub(id);

    this.connecting.set(false);
  }

  private async acquireMedia(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      this.hasVideo.set(true);
      this.hasAudio.set(true);
      this.camOn.set(true);
      return;
    } catch {
      this.hasVideo.set(false);
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.hasAudio.set(true);
      this.hasVideo.set(false);
      this.camOn.set(false);
      this._toast.show('تم تشغيل الميكروفون فقط — لا توجد كاميرا متاحة', 'info');
    } catch {
      this.hasAudio.set(false);
      this._toast.show('تعذر الاتصال بالميكروفون أو الكاميرا', 'error');
    }
  }

  private async setupPeer(): Promise<void> {
    if (!this.localStream) return;

    this.peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    this.localStream.getTracks().forEach((track) => {
      this.peer!.addTrack(track, this.localStream!);
    });

    this.peer.ontrack = (ev) => {
      const remoteEl = this.remoteVideo()?.nativeElement;
      if (remoteEl) remoteEl.srcObject = ev.streams[0];
    };
  }

  private async setupHub(appointmentId: string): Promise<void> {
    try {
      this.hub = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7058/hubs/videocall?appointmentId=${appointmentId}`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      this.hub.onreconnecting(() => this.connected.set(false));
      this.hub.onreconnected(() => this.connected.set(true));
      this.hub.onclose(() => this.connected.set(false));

      await this.hub.start();
      await this.hub.invoke('JoinAppointment', appointmentId);
      this.connected.set(true);
    } catch {
      this._toast.show('تعذر الاتصال بخادم المكالمة', 'error');
    }
  }

  toggleMic(): void {
    if (!this.hasAudio()) {
      this._toast.show('لا يوجد ميكروفون متاح', 'error');
      return;
    }
    const next = !this.micOn();
    this.micOn.set(next);
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = next));
  }

  toggleCam(): void {
    if (!this.hasVideo()) {
      this._toast.show('لا توجد كاميرا متاحة على هذا الجهاز', 'info');
      return;
    }
    const next = !this.camOn();
    this.camOn.set(next);
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = next));
  }

  end(): void {
    this._router.navigate(['/my-appointments']);
  }

  ngOnDestroy(): void {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.peer?.close();
    this.hub?.stop();
  }
}