import { Service, signal, WritableSignal } from '@angular/core';

export type TType = 'success' | 'error' | 'info';

export interface IToast {
    id: number;
    message: string;
    type: TType;
}

@Service()
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId = 0;

    show(message: string, type: IToast['type'] = 'info', duration: number = 3200): void {
        const id = this.nextId++;
        this.toasts.update((list) => [...list, { id, type, message }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }
}