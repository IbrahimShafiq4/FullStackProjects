import { Service, signal, WritableSignal } from '@angular/core';

export type TType = 'success' | 'error' | 'info';

export interface IToast {
    id: number;
    message: string;
    type: TType;
}

@Service()
export class ToastService {
    toasts          : WritableSignal<IToast[]>  = signal<IToast[]>([]);
    private nextId  : number                    = 0;

    show(message: string, type: IToast['type'] = 'info', duration: number = 3000) {
        const id = this.nextId++;
        this.toasts.update((list: IToast[]) => [...list, { id, type, message }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void { this.toasts.update((list: IToast[]) => list.filter((toast: IToast) => toast.id != id)); }
}