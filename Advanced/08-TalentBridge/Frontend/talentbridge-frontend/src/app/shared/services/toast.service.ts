import { Service, signal, WritableSignal } from '@angular/core';

export type TToast = 'success' | 'error' | 'info';

export interface IToast {
    id: number;
    message: string;
    type: TToast;
}

@Service()
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId: number = 0;

    show(message: string, type: IToast['type'] = 'info', duration: number = 3000) {
        const id = this.nextId++;
        this.toasts.update((toasts: IToast[]) => [...toasts, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void {
        this.toasts.update((toasts: IToast[]) => toasts.filter((toast: IToast) => toast.id !== id));
    }
}
