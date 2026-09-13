import { Service, signal } from '@angular/core';

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

@Service()
export class ToastService {
    toasts = signal<Toast[]>([]);
    private nextId = 0;

    show(message: string, type: Toast['type'] = 'info', duration = 3000) {
        const id = this.nextId++;
        this.toasts.update((list) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) { this.toasts.update((list) => list.filter((t) => t.id !== id)); }
}