import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { SignalrChatService } from './signalr-chat.service';

export type LiveState = 'idle' | 'connecting' | 'connected' | 'disconnected';

@Injectable({ providedIn: 'root' })
export class WebrtcService {
    private signalr: SignalrChatService = inject(SignalrChatService);

    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;

    isInCall: WritableSignal<boolean> = signal(false);
    liveState: WritableSignal<LiveState> = signal('idle');
    isMuted: WritableSignal<boolean> = signal(false);
    remoteAudioStream: WritableSignal<MediaStream | null> = signal(null);

    private readonly rtcConfig: RTCConfiguration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    registerHandlers(): void {
        const hub = this.signalr.connection;
        if (!hub) return;

        hub.on('ReceiveOffer', async (fromId: string, offer: string) => {
            await this.handleIncomingOffer(fromId, offer);
        });
        hub.on('ReceiveAnswer', async (_from: string, answer: string) => {
            if (!this.peerConnection) return;
            await this.peerConnection.setRemoteDescription(JSON.parse(answer));
            this.liveState.set('connected');
        });
        hub.on('ReceiveIceCandidate', async (_from: string, candidate: string) => {
            if (!this.peerConnection) return;
            try {
                await this.peerConnection.addIceCandidate(JSON.parse(candidate));
            } catch { /* tolerate stale candidates */ }
        });
    }

    async startCall(targetConnectionId: string): Promise<void> {
        this.liveState.set('connecting');
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.buildPeer(targetConnectionId);

        const offer = await this.peerConnection!.createOffer();
        await this.peerConnection!.setLocalDescription(offer);
        await this.signalr.connection?.invoke('SendOffer', targetConnectionId, JSON.stringify(offer));
        this.isInCall.set(true);
    }

    private async handleIncomingOffer(fromId: string, offerJson: string): Promise<void> {
        this.liveState.set('connecting');
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.buildPeer(fromId);

        await this.peerConnection!.setRemoteDescription(JSON.parse(offerJson));
        const answer = await this.peerConnection!.createAnswer();
        await this.peerConnection!.setLocalDescription(answer);
        await this.signalr.connection?.invoke('SendAnswer', fromId, JSON.stringify(answer));
        this.isInCall.set(true);
        this.liveState.set('connected');
    }

    private buildPeer(targetConnectionId: string): void {
        this.peerConnection = new RTCPeerConnection(this.rtcConfig);

        this.localStream!.getTracks().forEach((track) => {
            this.peerConnection!.addTrack(track, this.localStream!);
        });

        this.peerConnection.ontrack = (event) => {
            this.remoteAudioStream.set(event.streams[0]);
        };

        this.peerConnection.onicecandidate = (event) => {
            if (!event.candidate) return;
            this.signalr.connection?.invoke(
                'SendIceCandidate',
                targetConnectionId,
                JSON.stringify(event.candidate)
            );
        };

        this.peerConnection.onconnectionstatechange = () => {
            const s = this.peerConnection?.connectionState;
            if (s === 'connected') this.liveState.set('connected');
            if (s === 'disconnected' || s === 'failed') this.liveState.set('disconnected');
        };
    }

    toggleMute(): void {
        if (!this.localStream) return;
        const next = !this.isMuted();
        this.localStream.getAudioTracks().forEach((t) => (t.enabled = !next));
        this.isMuted.set(next);
    }

    endCall(): void {
        this.localStream?.getTracks().forEach((t) => t.stop());
        this.peerConnection?.close();
        this.localStream = null;
        this.peerConnection = null;
        this.remoteAudioStream.set(null);
        this.isInCall.set(false);
        this.isMuted.set(false);
        this.liveState.set('idle');
    }
}