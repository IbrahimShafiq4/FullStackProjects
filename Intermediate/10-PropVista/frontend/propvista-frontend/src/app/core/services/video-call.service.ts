import { Injectable, signal, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({
    providedIn: 'root'
})
export class VideoCallService {
    private toastService = inject(ToastService);

    private hubConnection: signalR.HubConnection | null = null;
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;

    isInCall = signal(false);
    localVideoStream = signal<MediaStream | null>(null);
    remoteVideoStream = signal<MediaStream | null>(null);
    isConnecting = signal(false);
    isWaitingForPeer = signal(false);
    isCaller = signal(false);

    private isInitiator = false;
    private targetConnectionId: string | null = null;
    private pendingOffer: { fromId: string; offer: string } | null = null;
    private viewingId: number | null = null;

    private readonly rtcConfig: RTCConfiguration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };

    async connectSignaling(viewingId: number, role: string) {
        if (this.hubConnection) {
            await this.endCall();
        }

        this.viewingId = viewingId;
        this.isInitiator = role === 'Seeker';

        this.isCaller.set(this.isInitiator);
        this.isConnecting.set(true);
        this.isWaitingForPeer.set(true);

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(
                'https://localhost:7123/hubs/videocall',
                {
                    withCredentials: true
                }
            )
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on(
            'PeerJoined',
            async (connectionId: string) => {
                console.log('👤 Peer joined:', connectionId);

                this.targetConnectionId = connectionId;
                this.isWaitingForPeer.set(false);

                if (this.isInitiator) {
                    try {
                        await this.startCall(connectionId);
                    } catch (error) {
                        console.error('❌ Start call error:', error);

                        this.isConnecting.set(false);
                        this.isWaitingForPeer.set(false);

                        this.toastService.show(
                            'حدث خطأ أثناء بدء المكالمة',
                            'error'
                        );
                    }
                }
            }
        );

        this.hubConnection.on(
            'ReceiveOffer',
            async (fromId: string, offer: string) => {
                console.log('📥 Offer received from:', fromId);

                if (this.isInitiator) return;

                this.pendingOffer = {
                    fromId,
                    offer
                };

                this.targetConnectionId = fromId;
                this.isWaitingForPeer.set(false);
                this.isConnecting.set(true);

                try {
                    await this.acceptCall();
                } catch (error) {
                    console.error('❌ Accept call error:', error);

                    this.isConnecting.set(false);

                    this.toastService.show(
                        'حدث خطأ أثناء قبول المكالمة',
                        'error'
                    );
                }
            }
        );

        this.hubConnection.on(
            'ReceiveAnswer',
            async (_: string, answer: string) => {
                console.log('📥 Answer received');

                if (!this.peerConnection) return;

                try {
                    await this.peerConnection.setRemoteDescription(
                        JSON.parse(answer)
                    );

                    console.log('✅ Remote answer applied');
                } catch (error) {
                    console.error(
                        '❌ Error setting remote answer:',
                        error
                    );
                }
            }
        );

        this.hubConnection.on(
            'ReceiveIceCandidate',
            async (_: string, candidate: string) => {
                console.log('🧊 ICE candidate received');

                if (!this.peerConnection) return;

                try {
                    await this.peerConnection.addIceCandidate(
                        JSON.parse(candidate)
                    );
                } catch (error) {
                    console.error(
                        '❌ Error adding ICE candidate:',
                        error
                    );
                }
            }
        );

        try {
            await this.hubConnection.start();

            console.log(
                '✅ SignalR connected:',
                this.hubConnection.connectionId
            );

            await this.hubConnection.invoke(
                'JoinCall',
                viewingId.toString()
            );

            console.log(
                '🚪 Joined viewing room:',
                viewingId
            );
        } catch (error) {
            console.error(
                '❌ SignalR connection error:',
                error
            );

            this.isConnecting.set(false);
            this.isWaitingForPeer.set(false);

            throw error;
        }
    }

    private async getLocalMedia(): Promise<MediaStream | null> {
        try {
            console.log('🎥 Trying camera + microphone...');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            console.log('✅ Camera + microphone acquired');

            return stream;
        } catch (videoError) {
            console.warn(
                '⚠️ Camera + microphone unavailable:',
                videoError
            );
        }

        try {
            console.log('🎤 Trying microphone only...');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
            });

            console.log('✅ Microphone acquired');

            this.toastService.show(
                'الكاميرا غير متاحة، سيتم تشغيل المكالمة صوتيًا',
                'info'
            );

            return stream;
        } catch (audioError) {
            console.warn(
                '⚠️ Microphone unavailable:',
                audioError
            );
        }

        console.warn(
            '⚠️ No camera or microphone available'
        );

        this.toastService.show(
            'لا توجد كاميرا أو ميكروفون، سيتم تشغيل وضع الاختبار',
            'info'
        );

        return null;
    }

    private createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(
            this.rtcConfig
        );

        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState;

            console.log(
                '🔗 Connection state:',
                state
            );

            if (state === 'connected') {
                this.isInCall.set(true);
                this.isConnecting.set(false);
                this.isWaitingForPeer.set(false);

                this.toastService.show(
                    'تم الاتصال بنجاح',
                    'success'
                );
            }

            if (state === 'failed') {
                this.isInCall.set(false);

                this.toastService.show(
                    'فشل الاتصال بالطرف الآخر',
                    'error'
                );
            }

            if (state === 'disconnected') {
                console.warn(
                    '⚠️ Peer disconnected'
                );
            }
        };

        this.peerConnection.oniceconnectionstatechange = () => {
            console.log(
                '🧊 ICE connection state:',
                this.peerConnection?.iceConnectionState
            );
        };

        this.peerConnection.ontrack = event => {
            console.log('🎥 Remote stream received');

            if (event.streams?.[0]) {
                this.remoteVideoStream.set(
                    event.streams[0]
                );
            }
        };

        return this.peerConnection;
    }

    private addLocalTracks() {
        if (!this.localStream || !this.peerConnection) {
            console.log(
                '⚠️ No local media tracks available'
            );
            return;
        }

        this.localStream.getTracks().forEach(track => {
            this.peerConnection!.addTrack(
                track,
                this.localStream!
            );

            console.log(
                `➕ Added ${track.kind} track`
            );
        });
    }

    private setupIceCandidateHandler(
        targetConnectionId: string
    ) {
        if (!this.peerConnection) return;

        this.peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log(
                    '🧊 Sending ICE candidate'
                );

                this.hubConnection?.invoke(
                    'SendIceCandidate',
                    targetConnectionId,
                    JSON.stringify(event.candidate)
                ).catch(error => {
                    console.error(
                        '❌ Error sending ICE candidate:',
                        error
                    );
                });
            }
        };
    }

    private async startCall(
        targetConnectionId: string
    ) {
        if (!this.isInitiator) return;

        console.log('📞 Starting call...');

        this.localStream =
            await this.getLocalMedia();

        if (this.localStream) {
            this.localVideoStream.set(
                this.localStream
            );
        }

        this.createPeerConnection();

        if (this.localStream) {
            this.addLocalTracks();
        }

        this.setupIceCandidateHandler(
            targetConnectionId
        );

        if (!this.peerConnection) return;

        console.log('📤 Creating offer...');

        const offer =
            await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(
            offer
        );

        console.log('📤 Sending offer...');

        await this.hubConnection?.invoke(
            'SendOffer',
            targetConnectionId,
            JSON.stringify(offer)
        );

        console.log('✅ Offer sent');

        this.isConnecting.set(false);
        this.isWaitingForPeer.set(false);
    }

    async acceptCall() {
        if (this.isInitiator) return;

        if (!this.pendingOffer) {
            console.warn(
                '⚠️ No pending offer'
            );

            return;
        }

        const {
            fromId,
            offer
        } = this.pendingOffer;

        console.log('📞 Accepting call...');

        this.localStream =
            await this.getLocalMedia();

        if (this.localStream) {
            this.localVideoStream.set(
                this.localStream
            );
        }

        this.createPeerConnection();

        if (this.localStream) {
            this.addLocalTracks();
        }

        this.setupIceCandidateHandler(
            fromId
        );

        if (!this.peerConnection) return;

        console.log(
            '📥 Setting remote offer...'
        );

        await this.peerConnection.setRemoteDescription(
            JSON.parse(offer)
        );

        console.log(
            '📤 Creating answer...'
        );

        const answer =
            await this.peerConnection.createAnswer();

        await this.peerConnection.setLocalDescription(
            answer
        );

        console.log(
            '📤 Sending answer...'
        );

        await this.hubConnection?.invoke(
            'SendAnswer',
            fromId,
            JSON.stringify(answer)
        );

        console.log('✅ Answer sent');

        this.pendingOffer = null;
        this.isConnecting.set(false);
        this.isWaitingForPeer.set(false);
    }

    async endCall() {
        console.log('📴 Ending call...');

        this.localStream?.getTracks().forEach(track => {
            track.stop();
        });

        if (this.peerConnection) {
            this.peerConnection.ontrack = null;
            this.peerConnection.onicecandidate = null;
            this.peerConnection.close();
            this.peerConnection = null;
        }

        if (this.hubConnection) {
            try {
                await this.hubConnection.stop();
            } catch (error) {
                console.error(
                    '❌ Error stopping SignalR:',
                    error
                );
            }

            this.hubConnection = null;
        }

        this.localStream = null;
        this.targetConnectionId = null;
        this.pendingOffer = null;
        this.viewingId = null;
        this.isInitiator = false;

        this.isInCall.set(false);
        this.localVideoStream.set(null);
        this.remoteVideoStream.set(null);
        this.isConnecting.set(false);
        this.isWaitingForPeer.set(false);
        this.isCaller.set(false);
    }
}