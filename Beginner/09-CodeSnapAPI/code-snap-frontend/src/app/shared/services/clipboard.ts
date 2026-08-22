import { Service, inject } from '@angular/core';
import { Toast } from '../../core/services/toast';

@Service()
export class Clipboard {
    private _Toast: Toast = inject(Toast);

    async copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            this._Toast.show("تم نسخ الكود", 'success');
        } catch {
            this._Toast.show("تعذر النسخ", 'error');
        }
    }
}
