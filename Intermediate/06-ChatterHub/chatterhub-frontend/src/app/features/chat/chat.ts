import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomsService, IRoomDetails, IRoomMessage } from '../../core/services/rooms.service';
import { ILiveMessage, SignalrChatService } from '../../core/services/signalr-chat.service';
import { WebrtcService } from '../../core/services/webrtc.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../shared/services/toast.service';
import { EmojiPickerComponent } from '../../shared/components/emoji-picker/emoji-picker';
import { IconComponent } from '../../shared/components/icon/icon/icon';

interface Message extends ILiveMessage {
  seq: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, IconComponent, EmojiPickerComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
  private roomsService = inject(RoomsService);
  private signalr = inject(SignalrChatService);
  private webrtc = inject(WebrtcService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  roomId = 0;
  room = signal<IRoomDetails | null>(null);
  messages: WritableSignal<Message[]> = signal<Message[]>([]);
  draft = signal<string>('');
  selectedFile: File | null = null;
  showEmoji = signal(false);

  private seqCounter = 0;
  private lastTypingSent = 0;

  readonly typingUser = this.signalr.typingUser;
  readonly roomUsers = this.signalr.roomUsers;
  readonly isInCall = this.webrtc.isInCall;
  readonly liveState = this.webrtc.liveState;
  readonly isMuted = this.webrtc.isMuted;

  constructor() {
    effect(() => {
      const incoming = this.signalr.incomingMessage();
      if (!incoming) return;
      this.messages.update((list) => [...list, { ...incoming, seq: ++this.seqCounter }]);
      queueMicrotask(() => this.scrollToBottom());
    });
  }

  async ngOnInit(): Promise<void> {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));

    this.roomsService.getRoomDetails(this.roomId).subscribe({
      next: (r) => {
        this.room.set(r);
        const list: Message[] = r.messages.map((m: IRoomMessage) => ({
          id: m.id,
          content: m.content,
          sentAt: m.sentAt,
          senderId: m.senderId,
          senderName: m.senderName,
          attachmentUrl: m.attachmentUrl,
          seq: ++this.seqCounter,
        }));
        this.messages.set(list);
        queueMicrotask(() => this.scrollToBottom());
      },
      error: () => {
        this.toast.show('Could not open this room', 'error');
        this.router.navigate(['/home']);
      },
    });

    await this.signalr.connect(this.roomId);
    this.webrtc.registerHandlers();
  }

  // ── Composer actions ────────────────────────────────────
  onDraftChange(value: string): void {
    this.draft.set(value);
    const now = Date.now();
    if (value && now - this.lastTypingSent > 1800) {
      this.lastTypingSent = now;
      void this.signalr.sendTyping(this.roomId);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    this.onSend();
  }

  // ── Emoji picker ────────────────────────────────────────
  toggleEmoji(event: MouseEvent): void {
    event.stopPropagation();
    this.showEmoji.update((v) => !v);
  }

  onEmojiPicked(emoji: string): void {
    this.draft.update((v) => v + emoji);
    this.inputEl?.nativeElement.focus();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.showEmoji()) this.showEmoji.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showEmoji()) this.showEmoji.set(false);
  }

  // ── Attach ──────────────────────────────────────────────
  triggerAttach(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    input.value = '';
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  // ── Send ────────────────────────────────────────────────
  onSend(): void {
    const content = this.draft().trim();
    if (!content && !this.selectedFile) return;

    const formData = new FormData();
    formData.append('content', content);
    if (this.selectedFile) formData.append('attachment', this.selectedFile);

    this.roomsService.sendMessage(this.roomId, formData).subscribe({
      next: () => {
        this.draft.set('');
        this.selectedFile = null;
      },
      error: () => this.toast.show('Message failed to send', 'error'),
    });
  }

  // ── WebRTC call ─────────────────────────────────────────
  async startCall(): Promise<void> {
    const users = this.roomUsers();
    if (!users.length) {
      this.toast.show('No one else is here', 'info');
      return;
    }
    await this.webrtc.startCall(users[0]);
  }

  toggleMute(): void { this.webrtc.toggleMute(); }
  endCall(): void { this.webrtc.endCall(); }

  // ── Helpers ─────────────────────────────────────────────
  isMe(m: Message): boolean {
    return m.senderId === this.auth.currentUser()?.userId;
  }

  isImage(url: string | null): boolean {
    return !!url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }

  attachmentName(url: string): string {
    return url.split('/').pop() ?? 'Attachment';
  }

  fileUrl(url: string): string {
    return `https://localhost:7128${url}`;
  }

  getInitial(name: string): string {
    return (name ?? '?').charAt(0).toUpperCase();
  }

  private scrollToBottom(): void {
    const el = document.querySelector('.stream');
    if (el) el.scrollTop = el.scrollHeight;
  }

  ngOnDestroy(): void {
    void this.signalr.disconnect();
    this.webrtc.endCall();
  }
}