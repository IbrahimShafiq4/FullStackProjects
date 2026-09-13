import { Service, signal, WritableSignal } from '@angular/core';

export type TToast = 'success' | 'error' | 'info';
export interface IToast {
    id      : number;
    message : string;
    type    : TToast;
    action? : { label: string; handler: () => void };
}

@Service()
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId = 0;

    show(message: string, type: IToast['type'] = 'info', duration = 3000, action?: IToast['action']) {
        const id = this.nextId++;
        const toast: IToast = { id, message, type };
        if (action) toast.action = action;
        this.toasts.update((list: IToast[]) => [...list, toast]);
        if (!action) {
            setTimeout(() => this.dimiss(id), duration);
        }
    }

    dimiss(id: number): void {
        this.toasts.update((list: IToast[]) => list.filter((toast: IToast) => toast.id != id));
    }
}