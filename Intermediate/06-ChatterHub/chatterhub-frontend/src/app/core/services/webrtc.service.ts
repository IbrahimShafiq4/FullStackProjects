import { Service, signal, inject, WritableSignal } from '@angular/core';
import { SignalrChatService } from './signalr-chat.service';

@Service()
export class WebrtcService {
    private signalr: SignalrChatService = inject(SignalrChatService);

    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;

    isInCall: WritableSignal<boolean> = signal(false);

    remoteAudioStream: WritableSignal<MediaStream | null> =
        signal<MediaStream | null>(null);

    private readonly rtcConfig: RTCConfiguration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };

    registerHandlers() {
        this.signalr._HubConnection?.on(
            'ReceiveOffer',
            async (fromId: string, offer: string) => {
                await this.handleIncomingOffer(fromId, offer);
            }
        );

        this.signalr._HubConnection?.on(
            'ReceiveAnswer',
            async (_fromId: string, answer: string) => {
                if (!this.peerConnection) return;

                await this.peerConnection.setRemoteDescription(
                    JSON.parse(answer)
                );
            }
        );

        this.signalr._HubConnection?.on(
            'ReceiveIceCandidate',
            async (
                _fromId: string,
                candidate: string
            ) => {
                if (!this.peerConnection) return;

                await this.peerConnection.addIceCandidate(
                    JSON.parse(candidate)
                );
            }
        );
    }

    async startCall(targetConnectionId: string) {
        this.localStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        this.peerConnection =
            new RTCPeerConnection(this.rtcConfig);

        this.localStream
            .getTracks()
            .forEach(track => {
                this.peerConnection!.addTrack(
                    track,
                    this.localStream!
                );
            });

        this.peerConnection.ontrack = event => {
            this.remoteAudioStream.set(
                event.streams[0]
            );
        };

        this.peerConnection.onicecandidate = event => {
            if (!event.candidate) return;

            this.signalr._HubConnection?.invoke(
                'SendIceCandidate',
                targetConnectionId,
                JSON.stringify(event.candidate)
            );
        };

        const offer =
            await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(
            offer
        );

        await this.signalr._HubConnection?.invoke(
            'SendOffer',
            targetConnectionId,
            JSON.stringify(offer)
        );

        this.isInCall.set(true);
    }

    private async handleIncomingOffer(
        fromId: string,
        offerJson: string
    ) {
        this.localStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        this.peerConnection =
            new RTCPeerConnection(this.rtcConfig);

        this.localStream
            .getTracks()
            .forEach(track => {
                this.peerConnection!.addTrack(
                    track,
                    this.localStream!
                );
            });

        this.peerConnection.ontrack = event => {
            this.remoteAudioStream.set(
                event.streams[0]
            );
        };

        this.peerConnection.onicecandidate = event => {
            if (!event.candidate) return;

            this.signalr._HubConnection?.invoke(
                'SendIceCandidate',
                fromId,
                JSON.stringify(event.candidate)
            );
        };

        await this.peerConnection.setRemoteDescription(
            JSON.parse(offerJson)
        );

        const answer =
            await this.peerConnection.createAnswer();

        await this.peerConnection.setLocalDescription(
            answer
        );

        await this.signalr._HubConnection?.invoke(
            'SendAnswer',
            fromId,
            JSON.stringify(answer)
        );

        this.isInCall.set(true);
    }

    endCall() {
        this.localStream
            ?.getTracks()
            .forEach(track => track.stop());

        this.peerConnection?.close();

        this.localStream = null;
        this.peerConnection = null;

        this.remoteAudioStream.set(null);
        this.isInCall.set(false);
    }
}