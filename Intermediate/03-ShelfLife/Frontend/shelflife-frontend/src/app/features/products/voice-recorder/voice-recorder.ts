import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { AudioRecorderService } from '../../../shared/services/audio-recorder-service';
@Component({
  selector: 'app-voice-recorder',
  template: `
    <div class="vr-row">
      <button
        type="button"
        class="vr-btn"
        [class.vr-btn-recording]="_recorder.isRecording()"
        (click)="onToggle()">
        @if (_recorder.isRecording()) {
          <span class="vr-btn-icon">■</span>
          <span>إيقاف التسجيل</span>
        } @else {
          <span class="vr-btn-icon">●</span>
          <span>تسجيل ملاحظة صوتية</span>
        }
      </button>

      @if (_recorder.recordedBlob() && !_recorder.isRecording()) {
        <button type="button" class="vr-confirm" (click)="onConfirm()">
          <span>✓</span>
          <span>استخدم التسجيل</span>
        </button>
      }
    </div>
  `,
  styles: `
    .vr-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .vr-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
    }

    .vr-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .vr-btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .vr-btn-recording {
      background: var(--danger);
      color: var(--surface);
    }

    .vr-btn-icon {
      font-family: var(--font-pixel-en);
      font-size: 18px;
      line-height: 1;
    }

    .vr-btn-recording .vr-btn-icon {
      animation: pixel-blink 0.8s steps(2) infinite;
    }

    .vr-confirm {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--surface);
      background: var(--olive);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
    }

    .vr-confirm:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }
  `
})
export class VoiceRecorder {
  public _recorder = inject(AudioRecorderService);

  recordingReady: OutputEmitterRef<Blob> = output<Blob>();

  async onToggle(): Promise<void> {
    if (this._recorder.isRecording()) {
      this._recorder.stopRecording();
    } else {
      this._recorder.reset();
      await this._recorder.startRecording();
    }
  }

  onConfirm(): void {
    const blob = this._recorder.recordedBlob();
    if (blob) {
      this.recordingReady.emit(blob);
      this._recorder.reset();
    }
  }
}