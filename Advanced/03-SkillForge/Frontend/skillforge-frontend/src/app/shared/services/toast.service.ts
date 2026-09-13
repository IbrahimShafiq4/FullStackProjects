import { Service, signal, WritableSignal } from '@angular/core';

export type TType = 'success' | 'error' | 'info';
export interface IToast {
    id      : number;
    message : string;
    type    : TType;
}

@Service()
export class ToastService {
    toasts          : WritableSignal<IToast[]>  = signal<IToast[]>([]);
    private nextId  : number                    = 0;

    show(message: string, type: IToast['type'] = 'info', duration = 300) {
        const id: number = this.nextId++;
        this.toasts.update((list: IToast[]) => [ ...list, { id, message, type } ]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) {
        this.toasts.update((list: IToast[]) => list.filter((toast: IToast) => toast.id != id));
    }
}