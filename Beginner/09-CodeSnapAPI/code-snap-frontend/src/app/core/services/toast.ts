import { Service, signal } from '@angular/core';

export type TToast = 'success' | 'error' | 'info';

export interface IToast {
    id: number;
    message: string;
    type: TToast;
}

@Service()
export class Toast {
    toasts = signal<IToast[]>([]);

    private nextId = 0;

    show(message: string, type: IToast['type'] = 'info', duration = 3000): void {
        const id = this.nextId++;
        this.toasts.update((list) => [...list, { id, message, type }])
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) {
        this.toasts.update((list) => list.filter((t) => t.id != id));
    }
}
