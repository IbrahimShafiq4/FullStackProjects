import { Service, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface IChatMessage {
    senderName: string;
    message: string;
    sentAt: string;
}

export interface IRaisedHandRequest {
    connectionId: string;
    studentName: string;
}

export interface IParticipant {
    connectionId: string;
    userName: string;
    isInstructor: boolean;
}

export interface IJoinRequest {
    connectionId: string;
    userName: string;
    hasPaid: boolean;
}

@Service()
export class LiveClassService {
    public _HubConnection: signalR.HubConnection | null = null;
    private peerConnections = new Map<string, RTCPeerConnection>();
    private _PendingIceCandidates = new Map<string, RTCIceCandidateInit[]>();

    localStream: MediaStream | null = null;
    screenStream: MediaStream | null = null;

    remoteStreams = signal<Map<string, MediaStream>>(new Map());
    participants = signal<IParticipant[]>([]);
    joinRequests = signal<IJoinRequest[]>([]);
    chatMessages = signal<IChatMessage[]>([]);
    raisedHands = signal<IRaisedHandRequest[]>([]);
    isHandApproved = signal<boolean>(false);
    isScreenSharing = signal<boolean>(false);
    sessionEnded = signal<boolean>(false);
    isJoinRejected = signal<boolean>(false);
    cameraOffPeers = signal<Set<string>>(new Set<string>());
    screenSharingPeers = signal<Set<string>>(new Set<string>());

    private readonly rtcConfig: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    async connect(sessionId: number, userName: string, isInstructor: boolean): Promise<void> {
        this._HubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7178/hubs/liveclass', { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        this.registerHandlers(sessionId);

        await this._HubConnection.start();
        await this._HubConnection.invoke('RequestJoin', sessionId.toString(), userName, isInstructor);
    }

    private registerHandlers(sessionId: number): void {
        this._HubConnection?.on('ParticipantJoined', async (
            connectionId: string,
            userName: string,
            isInstructor: boolean,
            shouldInitiate: boolean,
            isCameraOff: boolean
        ) => {
            this.participants.update((list) => {
                const exists = list.some((p) => p.connectionId === connectionId);
                if (exists) return list;
                return [...list, { connectionId, userName, isInstructor }];
            });

            if (isCameraOff) {
                this.cameraOffPeers.update((set) => {
                    const newSet = new Set(set);
                    newSet.add(connectionId);
                    return newSet;
                });
            }

            if (shouldInitiate) {
                await this._StartPeerConnection(connectionId, true);
            }
        });

        this._HubConnection?.on('ParticipantCameraToggled', (connectionId: string, isOff: boolean) => {
            this.cameraOffPeers.update((set) => {
                const newSet = new Set(set);
                if (isOff) newSet.add(connectionId);
                else newSet.delete(connectionId);
                return newSet;
            });
        });

        this._HubConnection?.on('ShareScreenStarted', (connectionId: string) => {
            this.screenSharingPeers.update((set) => {
                const newSet = new Set(set);
                newSet.add(connectionId);
                return newSet;
            });
        });

        this._HubConnection?.on('ShareScreenStopped', (connectionId: string) => {
            this.screenSharingPeers.update((set) => {
                const newSet = new Set(set);
                newSet.delete(connectionId);
                return newSet;
            });
        });

        this._HubConnection?.on('ReceiveOffer', async (fromId: string, offer: string) => {
            await this._StartPeerConnection(fromId, false, offer);
        });

        this._HubConnection?.on('ReceiveAnswer', async (fromId: string, answer: string) => {
            const pc = this.peerConnections.get(fromId);
            if (pc && pc.signalingState === 'have-local-offer') {
                try {
                    await pc.setRemoteDescription(JSON.parse(answer));
                } catch { }
            }
        });

        this._HubConnection?.on('ReceiveIceCandidate', async (fromId: string, candidate: string) => {
            const parsed: RTCIceCandidateInit = JSON.parse(candidate);
            const pc = this.peerConnections.get(fromId);

            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
                try {
                    await pc.addIceCandidate(parsed);
                } catch { }
            } else {
                const queue = this._PendingIceCandidates.get(fromId) ?? [];
                queue.push(parsed);
                this._PendingIceCandidates.set(fromId, queue);
            }
        });

        this._HubConnection?.on('NewChatMessage', (senderName: string, message: string, sentAt: string) => {
            this.chatMessages.update((list) => {
                const exists = list.some((m) => m.senderName === senderName && m.message === message && m.sentAt === sentAt);
                if (exists) return list;
                return [...list, { senderName, message, sentAt }];
            });
        });

        this._HubConnection?.on('HandRaised', (connectionId: string, studentName: string) => {
            this.raisedHands.update((list) => {
                const exists = list.some((h) => h.connectionId === connectionId);
                if (exists) return list;
                return [...list, { connectionId, studentName }];
            });
        });

        this._HubConnection?.on('HandLowered', (connectionId: string) => {
            this.raisedHands.update((list) => list.filter((h) => h.connectionId !== connectionId));
        });

        this._HubConnection?.on('HandApproved', () => this.isHandApproved.set(true));
        this._HubConnection?.on('HandRejected', () => this.isHandApproved.set(false));

        this._HubConnection?.on('JoinRequested', (connectionId: string, userName: string, hasPaid: boolean) => {
            this.joinRequests.update((list) => {
                const exists = list.some((r) => r.connectionId === connectionId);
                if (exists) return list;
                return [...list, { connectionId, userName, hasPaid }];
            });
        });

        this._HubConnection?.on('JoinApproved', async () => {
            const userName = localStorage.getItem('pendingUserName') ?? 'مستخدم';
            const isInstructor = localStorage.getItem('pendingIsInstructor') === 'true';
            await this._HubConnection?.invoke('JoinSession', sessionId.toString(), userName, isInstructor);
        });

        this._HubConnection?.on('JoinRejected', () => {
            this.isJoinRejected.set(true);
            this.sessionEnded.set(true);
        });

        this._HubConnection?.on('SessionEnded', () => {
            this.sessionEnded.set(true);
        });

        this._HubConnection?.on('AllRequestsApproved', () => {
            this.joinRequests.set([]);
        });

        this._HubConnection?.on('AllRequestsRejected', () => {
            this.joinRequests.set([]);
        });
    }

    private async _StartPeerConnection(connectionId: string, isInitiator: boolean, incomingOffer?: string): Promise<void> {
        let pc = this.peerConnections.get(connectionId);

        if (!pc) {
            pc = new RTCPeerConnection(this.rtcConfig);
            this.peerConnections.set(connectionId, pc);

            pc.ontrack = (event) => {
                this.remoteStreams.update((map) => {
                    const newMap = new Map(map);
                    newMap.set(connectionId, event.streams[0]);
                    return newMap;
                });
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this._HubConnection?.invoke('SendIceCandidate', connectionId, JSON.stringify(event.candidate));
                }
            };
        }

        if (isInitiator) {
            const isSharing = this.isScreenSharing();
            const videoStream = isSharing && this.screenStream ? this.screenStream : this.localStream;
            const videoTrack = videoStream?.getVideoTracks()[0];
            const audioTrack = this.localStream?.getAudioTracks()[0];

            if (audioTrack && this.localStream) {
                const existing = pc.getSenders().find((s) => s.track?.kind === 'audio');
                if (existing) await existing.replaceTrack(audioTrack);
                else pc.addTrack(audioTrack, this.localStream);
            }

            if (videoTrack && videoStream) {
                const existing = pc.getSenders().find((s) => s.track?.kind === 'video');
                if (existing) await existing.replaceTrack(videoTrack);
                else pc.addTrack(videoTrack, videoStream);
            }

            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await this._HubConnection?.invoke('SendOffer', connectionId, JSON.stringify(offer));
            } catch { }
        } else if (incomingOffer) {
            try {
                await pc.setRemoteDescription(JSON.parse(incomingOffer));

                const isSharing = this.isScreenSharing();
                const videoStream = isSharing && this.screenStream ? this.screenStream : this.localStream;
                const videoTrack = videoStream?.getVideoTracks()[0];
                const audioTrack = this.localStream?.getAudioTracks()[0];

                if (audioTrack && this.localStream) {
                    const existing = pc.getSenders().find((s) => s.track?.kind === 'audio');
                    if (!existing) pc.addTrack(audioTrack, this.localStream);
                }

                if (videoTrack && videoStream) {
                    const existing = pc.getSenders().find((s) => s.track?.kind === 'video');
                    if (!existing) pc.addTrack(videoTrack, videoStream);
                }

                const queued = this._PendingIceCandidates.get(connectionId);
                if (queued) {
                    for (const c of queued) {
                        try { await pc.addIceCandidate(c); } catch { }
                    }
                    this._PendingIceCandidates.delete(connectionId);
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await this._HubConnection?.invoke('SendAnswer', connectionId, JSON.stringify(answer));
            } catch { }
        }
    }

    async startCamera(): Promise<void> {
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        this.localStream.getAudioTracks().forEach((track: MediaStreamTrack) => track.enabled = false);
        this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => track.enabled = false);
    }

    async startScreenShare(sessionId: number): Promise<void> {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 30 },
            audio: false
        });
        this.isScreenSharing.set(true);

        const screenTrack = this.screenStream.getVideoTracks()[0];

        for (const [, pc] of this.peerConnections) {
            const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
            if (videoSender) {
                await videoSender.replaceTrack(screenTrack);
            } else {
                pc.addTrack(screenTrack, this.screenStream!);
            }
        }

        for (const [connectionId, pc] of this.peerConnections) {
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await this._HubConnection?.invoke('SendOffer', connectionId, JSON.stringify(offer));
            } catch { }
        }

        await this._HubConnection?.invoke('NotifyScreenShareStarted', sessionId.toString());
        screenTrack.onended = () => this.stopScreenShar(sessionId);
    }

    async stopScreenShar(sessionId: number): Promise<void> {
        this.screenStream?.getTracks().forEach((t) => t.stop());
        this.screenStream = null;
        this.isScreenSharing.set(false);

        const cameraTrack = this.localStream?.getVideoTracks()[0];

        for (const [, pc] of this.peerConnections) {
            const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
            if (videoSender && cameraTrack) {
                await videoSender.replaceTrack(cameraTrack);
            }
        }

        for (const [connectionId, pc] of this.peerConnections) {
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await this._HubConnection?.invoke('SendOffer', connectionId, JSON.stringify(offer));
            } catch { }
        }

        await this._HubConnection?.invoke('NotifyScreenShareStopped', sessionId.toString());
    }

    toggleCameraBroadcast(sessionId: number, isOff: boolean): void {
        this._HubConnection?.invoke('CameraToggled', sessionId.toString(), isOff);
    }

    lowerHand(sessionId: number, studentName: string): void {
        this._HubConnection?.invoke('LowerHand', sessionId.toString(), studentName);
    }

    approveJoin(sessionId: number, connectionId: string): void {
        this._HubConnection?.invoke('ApproveJoin', sessionId.toString(), connectionId);
        this.joinRequests.update((list) => list.filter((r) => r.connectionId !== connectionId));
    }

    rejectJoin(sessionId: number, connectionId: string): void {
        this._HubConnection?.invoke('RejectJoin', sessionId.toString(), connectionId);
        this.joinRequests.update((list) => list.filter((r) => r.connectionId !== connectionId));
    }

    approveAll(sessionId: number): void {
        this._HubConnection?.invoke('ApproveAll', sessionId.toString());
        this.joinRequests.set([]);
    }

    rejectAll(sessionId: number): void {
        this._HubConnection?.invoke('RejectAll', sessionId.toString());
        this.joinRequests.set([]);
    }

    endSession(sessionId: number): void {
        this._HubConnection?.invoke('EndSession', sessionId.toString());
    }

    sendChatMessage(sessionId: number, senderName: string, message: string): void {
        this._HubConnection?.invoke('SendChatMessage', sessionId.toString(), senderName, message);
    }

    raiseHand(sessionId: number, studentName: string): void {
        this._HubConnection?.invoke('RaiseHand', sessionId.toString(), studentName);
    }

    approvedHand(sessionId: number, connectionId: string): void {
        this._HubConnection?.invoke('ApproveHand', sessionId.toString(), connectionId);
        this.raisedHands.update((hands) => hands.filter((h) => h.connectionId !== connectionId));
    }

    sendDrawEvent(sessionId: number, x: number, y: number, isNewStroke: boolean): void {
        this._HubConnection?.invoke('SendDrawEvent', sessionId.toString(), x, y, isNewStroke);
    }

    clearWhiteboard(sessionId: number): void {
        this._HubConnection?.invoke('ClearWhiteboard', sessionId.toString());
    }

    toggleLocalAudio(enabled: boolean): void {
        this.localStream?.getAudioTracks().forEach((track: MediaStreamTrack) => track.enabled = enabled);
    }

    toggleLocalVideo(enabled: boolean): void {
        this.localStream?.getVideoTracks().forEach((track: MediaStreamTrack) => track.enabled = enabled);
    }

    isPeerCameraOff(connectionId: string): boolean {
        return this.cameraOffPeers().has(connectionId);
    }

    isPeerScreenSharing(connectionId: string): boolean {
        return this.screenSharingPeers().has(connectionId);
    }

    disconnect(): void {
        this.peerConnections.forEach((pc) => pc.close());
        this.peerConnections.clear();
        this._PendingIceCandidates.clear();
        this.localStream?.getTracks().forEach((t) => t.stop());
        this.screenStream?.getTracks().forEach((t) => t.stop());
        this._HubConnection?.stop();
        this._HubConnection = null;
        this.localStream = null;
        this.screenStream = null;
        this.remoteStreams.set(new Map());
        this.participants.set([]);
        this.joinRequests.set([]);
        this.chatMessages.set([]);
        this.raisedHands.set([]);
        this.isHandApproved.set(false);
        this.isScreenSharing.set(false);
        this.sessionEnded.set(false);
        this.isJoinRejected.set(false);
        this.cameraOffPeers.set(new Set());
        this.screenSharingPeers.set(new Set());
    }
}