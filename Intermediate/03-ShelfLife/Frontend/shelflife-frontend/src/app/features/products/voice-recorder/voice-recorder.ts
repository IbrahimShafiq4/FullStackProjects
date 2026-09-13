import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { AudioRecorderService } from '../../../shared/services/audio-recorder-service';

@Component({
  imports: [],
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.html',
})
export class VoiceRecorder {

  _Recorder = inject(AudioRecorderService);

  recordingReady: OutputEmitterRef<Blob> = output<Blob>();

  async onToggleRecording() {
    if (this._Recorder.isRecording()) {
      this._Recorder.stopRecording();
    } else {
      this._Recorder.reset();
      await this._Recorder.startRecording();
    }
  }

  onConfirm() {
    const blob = this._Recorder.recordedBlob();

    if (blob) {
      this.recordingReady.emit(blob);
      this._Recorder.reset();
    }
  }
}