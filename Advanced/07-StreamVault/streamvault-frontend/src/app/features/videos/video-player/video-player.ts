import { HttpClient } from '@angular/common/http';
import {
    Component, computed, effect, ElementRef, inject, input, OnDestroy, OnInit,
    Signal, viewChild, WritableSignal, signal
} from '@angular/core';
import { environment } from '../../../src/environments';

@Component({
    selector: 'app-video-player',
    imports: [],
    templateUrl: './video-player.html',
    styleUrl: './video-player.css'
})
export class VideoPlayer implements OnInit, OnDestroy {
    private readonly _HttpClient: HttpClient = inject(HttpClient);

    public videoId = input.required<number>();
    public title = input<string>('درس فيديو');

    public videoSrc: Signal<string> = computed(() =>
        `${environment.apiUrl}/api/videos/${this.videoId()}/stream`
    );

    public isLoading: WritableSignal<boolean> = signal<boolean>(true);
    public hasError: WritableSignal<boolean> = signal<boolean>(false);
    public isPlaying: WritableSignal<boolean> = signal<boolean>(false);
    public isFullscreen: WritableSignal<boolean> = signal<boolean>(false);
    public currentTime: WritableSignal<number> = signal<number>(0);
    public duration: WritableSignal<number> = signal<number>(0);

    private readonly _VideoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
    private _SaveInterval: ReturnType<typeof setInterval> | null = null;
    private _LastVideoId: number = 0;

    constructor() {
        effect(() => {
            const currentVideoId = this.videoId();
            const video = this._VideoRef()?.nativeElement;

            if (currentVideoId !== this._LastVideoId) {
                this._LastVideoId = currentVideoId;
                this.isLoading.set(true);
                this.hasError.set(false);
                this.currentTime.set(0);
                this.duration.set(0);

                if (video) {
                    video.pause();
                    video.load();
                }

                this._LoadProgress();
            }
        });
    }

    public ngOnInit(): void {
        document.addEventListener('fullscreenchange', this._OnFullscreenChange);
        this._SaveInterval = setInterval(() => this._SaveProgress(), 10000);
    }

    private _LoadProgress(): void {
        const currentVideoId = this.videoId();

        this._HttpClient.get<{ lastPositionSeconds: number }>(
            `${environment.apiUrl}/api/progress/video/${currentVideoId}`,
            { withCredentials: true }
        ).subscribe({
            next: (res) => {
                const video = this._VideoRef()?.nativeElement;
                if (video && res.lastPositionSeconds > 0 && (!video.duration || res.lastPositionSeconds < video.duration)) {
                    video.currentTime = res.lastPositionSeconds;
                }
            }
        });
    }

    public onLoaded(): void {
        this.isLoading.set(false);
        this.hasError.set(false);
    }

    public onMetadataLoaded(): void {
        const video = this._VideoRef()?.nativeElement;
        if (video) {
            this.duration.set(video.duration);
        }
    }

    public onError(): void {
        this.isLoading.set(false);
        this.hasError.set(true);
    }

    public onPlay(): void {
        this.isPlaying.set(true);
    }

    public onPause(): void {
        this.isPlaying.set(false);
        this._SaveProgress();
    }

    public onTimeUpdate(): void {
        const video = this._VideoRef()?.nativeElement;
        if (!video) return;
        this.currentTime.set(video.currentTime);
    }

    public onEnded(): void {
        this.isPlaying.set(false);
        this._SaveProgress();
    }

    private _SaveProgress(): void {
        const video = this._VideoRef()?.nativeElement;
        if (!video || video.currentTime === 0) return;

        this._HttpClient.post(
            `${environment.apiUrl}/api/progress`,
            {
                videoId: this.videoId(),
                lastPositionSeconds: Math.floor(video.currentTime)
            },
            { withCredentials: true }
        ).subscribe();
    }

    public formatDuration(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }

    public getProgressPercent(): number {
        const total = this.duration();
        if (!total) return 0;
        return Math.min(100, Math.round((this.currentTime() / total) * 100));
    }

    public onToggleFullscreen(): void {
        const video = this._VideoRef()?.nativeElement;
        if (!video) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            video.requestFullscreen();
        }
    }

    private readonly _OnFullscreenChange = (): void => {
        this.isFullscreen.set(document.fullscreenElement !== null);
    };

    public ngOnDestroy(): void {
        document.removeEventListener('fullscreenchange', this._OnFullscreenChange);

        if (this._SaveInterval) {
            clearInterval(this._SaveInterval);
            this._SaveInterval = null;
        }

        this._SaveProgress();

        const video = this._VideoRef()?.nativeElement;
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
        }
    }
}