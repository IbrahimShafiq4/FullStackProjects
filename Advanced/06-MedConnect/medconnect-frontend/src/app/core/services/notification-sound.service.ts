import { Injectable, signal } from '@angular/core';

export type TSoundType = 'info' | 'success' | 'urgent' | 'error';

interface ITone {
    freq: number;
    delay: number;
    duration: number;
    volume?: number;
    wave?: OscillatorType;
}

@Injectable({ providedIn: 'root' })
export class NotificationSoundService {
    private ctx: AudioContext | null = null;
    private unlocked = signal(false);

    isUnlocked(): boolean {
        return this.unlocked();
    }

    unlock(): void {
        if (this.unlocked()) return;
        try {
            const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!Ctx) return;
            this.ctx = new Ctx();
            this.ctx!.resume();
            this.unlocked.set(true);
        } catch {
            this.unlocked.set(false);
        }
    }

    play(type: TSoundType = 'info'): void {
        if (!this.unlocked() || !this.ctx) return;

        const tones = this.getTones(type);
        const now = this.ctx.currentTime;

        tones.forEach((t) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = t.wave ?? 'sine';
            osc.frequency.value = t.freq;

            const start = now + t.delay;
            const end = start + t.duration;
            const vol = t.volume ?? 0.15;

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(vol, start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0005, end);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(end + 0.05);
        });
    }

    private getTones(type: TSoundType): ITone[] {
        switch (type) {
            case 'success':
                return [
                    { freq: 587, delay: 0, duration: 0.18, volume: 0.14 },
                    { freq: 784, delay: 0.13, duration: 0.28, volume: 0.16 },
                ];
            case 'urgent':
                return [
                    { freq: 880, delay: 0, duration: 0.12, volume: 0.18, wave: 'triangle' },
                    { freq: 1108, delay: 0.12, duration: 0.12, volume: 0.18, wave: 'triangle' },
                    { freq: 1318, delay: 0.24, duration: 0.22, volume: 0.18, wave: 'triangle' },
                ];
            case 'error':
                return [
                    { freq: 440, delay: 0, duration: 0.16, volume: 0.15, wave: 'sawtooth' },
                    { freq: 311, delay: 0.15, duration: 0.24, volume: 0.15, wave: 'sawtooth' },
                ];
            case 'info':
            default:
                return [
                    { freq: 880, delay: 0, duration: 0.22, volume: 0.12 },
                ];
        }
    }
}