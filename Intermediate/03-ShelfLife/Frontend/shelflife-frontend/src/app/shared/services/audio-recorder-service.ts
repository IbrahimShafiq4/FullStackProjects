import { Service, signal, WritableSignal } from '@angular/core';

@Service()
export class AudioRecorderService {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];

    isRecording: WritableSignal<boolean> = signal<boolean>(false);
    recordedBlob: WritableSignal<Blob | null> = signal<Blob | null>(null);

    async startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.recordedBlob.set(blob);

            stream.getTracks().forEach((track) => track.stop());
        };

        this.mediaRecorder.start();
        this.isRecording.set(true);
    }

    stopRecording() {
        this.mediaRecorder?.stop();
        this.isRecording.set(false);
    }

    reset() {
        this.recordedBlob.set(null);
    }
}
