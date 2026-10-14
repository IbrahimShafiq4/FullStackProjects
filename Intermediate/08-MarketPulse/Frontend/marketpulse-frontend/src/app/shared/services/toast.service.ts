import { Service, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';
export interface IToast { id: number; message: string; type: ToastType; }

@Service()
export class ToastService {
    toasts = signal<IToast[]>([]);
    private nextId = 0;

    show(message: string, type: ToastType = 'info', duration = 3200) {
        const id = this.nextId++;
        this.toasts.update(list => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) {
        this.toasts.update(list => list.filter(t => t.id !== id));
    }
}