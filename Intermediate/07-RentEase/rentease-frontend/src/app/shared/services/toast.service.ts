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

    show(message: string, type: IToast['type'] = 'info', duration = 300) {
        const id = this.nextId++;
        this.toasts.update((list: IToast[]) => [...list, { id, message, type }]);
        setTimeout(() => this.dimiss(id), duration);
    }

    dimiss(id: number): void {
        this.toasts.update((list: IToast[]) => list.filter((t: IToast) => t.id !== id))
    }
}
