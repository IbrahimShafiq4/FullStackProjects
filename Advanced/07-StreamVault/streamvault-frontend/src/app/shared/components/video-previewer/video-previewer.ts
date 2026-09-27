import { Component, ElementRef, input, OnDestroy, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { environment } from '../../../src/environments';

@Component({
  selector: 'app-video-previewer',
  imports: [],
  templateUrl: './video-previewer.html',
  styleUrl: './video-previewer.css'
})
export class VideoPreviewer implements OnInit, OnDestroy {
  public videoId = input.required<number>();
  public title = input<string>('فيديو');

  public videoSrc: string = '';
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public hasError: WritableSignal<boolean> = signal<boolean>(false);
  public isPlaying: WritableSignal<boolean> = signal<boolean>(false);
  public isFullscreen: WritableSignal<boolean> = signal<boolean>(false);

  private readonly _VideoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  public ngOnInit(): void {
    this.videoSrc = `${environment.apiUrl}/api/videos/${this.videoId()}/stream`;
  }

  public onLoaded(): void {
    this.isLoading.set(false);
    this.hasError.set(false);
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
  }

  public onFullscreenChange(): void {
    this.isFullscreen.set(document.fullscreenElement !== null);
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

  public ngOnDestroy(): void {
    const video = this._VideoRef()?.nativeElement;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }
}