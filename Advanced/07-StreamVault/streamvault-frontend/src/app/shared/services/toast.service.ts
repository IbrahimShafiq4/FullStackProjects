import { Service, signal, WritableSignal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface IToast {
    id: number;
    message: string;
    type: ToastType;
}

@Service()
export class ToastService {
    public toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private _NextId: number = 0;

    public show(message: string, type: ToastType = 'error', duration: number = 3500): void {
        const id: number = this._NextId++;
        this.toasts.update((list: IToast[]) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    public dismiss(id: number): void {
        this.toasts.update((list: IToast[]) => list.filter((toast: IToast) => toast.id !== id));
    }
}