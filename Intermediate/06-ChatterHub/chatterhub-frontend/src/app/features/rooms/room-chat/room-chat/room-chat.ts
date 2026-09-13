import { DatePipe } from '@angular/common';
import {
    Component,
    effect,
    inject,
    OnDestroy,
    OnInit,
    signal,
    WritableSignal
} from '@angular/core';
import {
    IRoomDetails,
    IRoomMessage,
    RoomsService
} from '../../../../core/services/rooms.service';
import {
    ILiveMessage,
    SignalrChatService
} from '../../../../core/services/signalr-chat.service';
import { WebrtcService } from '../../../../core/services/webrtc.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-room-chat',
    imports: [DatePipe],
    templateUrl: './room-chat.html'
})
export class RoomChat implements OnInit, OnDestroy {
    private readonly roomsService = inject(RoomsService);
    private readonly signalr = inject(SignalrChatService);
    private readonly webrtc = inject(WebrtcService);
    private readonly route = inject(ActivatedRoute);

    messages: WritableSignal<ILiveMessage[]> =
        signal<ILiveMessage[]>([]);

    newMessage: WritableSignal<string> =
        signal<string>('');

    selectedFile: File | null = null;

    roomId!: number;

    currentUserId = '';

    constructor() {
        effect(() => {
            const incoming =
                this.signalr.incomingMessage();

            if (!incoming)
                return;

            this.messages.update(list => [
                ...list,
                incoming
            ]);
        });
    }

    async ngOnInit(): Promise<void> {
        this.roomId = Number(
            this.route.snapshot.paramMap.get('id')
        );

        this.currentUserId =
            localStorage.getItem('userId') ?? '';

        this.roomsService
            .getRoomDetails(this.roomId)
            .subscribe({
                next: (room: IRoomDetails) => {
                    const messages: ILiveMessage[] =
                        room.messages.map(
                            (message: IRoomMessage) => ({
                                id: message.id,
                                content: message.content,
                                sentAt: message.sentAt,
                                senderId: message.senderId,
                                senderName: message.senderName,
                                attachmentUrl:
                                    message.attachmentUrl
                            })
                        );

                    this.messages.set(messages);
                }
            });

        await this.signalr.connect(this.roomId);

        this.webrtc.registerHandlers();
    }

    onFileSelected(event: Event): void {
        const input =
            event.target as HTMLInputElement;

        if (!input.files?.length)
            return;

        this.selectedFile =
            input.files[0];
    }

    removeSelectedFile(): void {
        this.selectedFile = null;
    }

    onSend(): void {
        const content =
            this.newMessage().trim();

        if (!content && !this.selectedFile)
            return;

        const formData =
            new FormData();

        formData.append(
            'content',
            content
        );

        if (this.selectedFile) {
            formData.append(
                'attachment',
                this.selectedFile
            );
        }

        this.roomsService
            .sendMessage(
                this.roomId,
                formData
            )
            .subscribe({
                next: () => {
                    this.newMessage.set('');
                    this.selectedFile = null;
                },
                error: error => {
                    console.error(
                        'Send message error:',
                        error
                    );
                }
            });
    }

    async onStartVoiceCall(): Promise<void> {
        const users =
            this.signalr.roomUsers();

        if (!users.length) {
            console.log(
                'مفيش مستخدم تاني في الغرفة'
            );
            return;
        }

        const targetConnectionId =
            users[0];

        await this.webrtc.startCall(
            targetConnectionId
        );
    }

    isMyMessage(message: ILiveMessage): boolean {
        return message.senderId === this.currentUserId;
    }

    getInitial(name: string): string {
        if (!name)
            return '?';

        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    }

    isImage(url: string | null): boolean {
        if (!url)
            return false;

        return /\.(jpg|jpeg|png|gif|webp)$/i.test(
            url
        );
    }

    getAttachmentName(url: string): string {
        if (!url)
            return 'Attachment';

        const name =
            url.split('/').pop();

        return name ?? 'Attachment';
    }

    getFileUrl(url: string): string {
        return `https://localhost:7128${url}`;
    }

    ngOnDestroy(): void {
        this.signalr.disconnect();
        this.webrtc.endCall();
    }
}