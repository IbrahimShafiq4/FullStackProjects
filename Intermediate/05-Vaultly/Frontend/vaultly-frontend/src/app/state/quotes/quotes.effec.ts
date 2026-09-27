import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastService } from "../../shared/services/toast.service";
import { QuotesActions } from "./quotes.actions";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { IQuotes } from "./quotes.model";
import { Router } from "@angular/router";

@Injectable()
export class QuotesEffects {
    private actions$ = inject(Actions);
    private _HttpClient: HttpClient = inject(HttpClient);
    private _ToastService: ToastService = inject(ToastService);
    private _Router: Router = inject(Router);
    private readonly API_URL: string = 'https://localhost:7162/api/quotes';

    loadQuotes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.loadQuotes),
            mergeMap(() =>
                this._HttpClient.get<IQuotes[]>(this.API_URL).pipe(
                    map((quotes: IQuotes[]) => QuotesActions.loadQuotesSuccess({ quotes })),
                    catchError(() => of(QuotesActions.loadQuotesFailure({ error: "فشل تحميل السجلات" })))
                )
            )
        )
    )

    createQuote$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.createQuote),
            mergeMap(({ quoteData }) =>
                this._HttpClient.post<IQuotes>(this.API_URL, quoteData).pipe(
                    map((quote: IQuotes) => QuotesActions.createQuoteSuccess({ quote })),
                    tap(() => {
                        this._ToastService.show('تم نقش العرض بنجاح', 'success');
                        this._Router.navigate(['/quotes']);
                    }),
                    catchError((error) => {
                        const msg = error.error?.message || error.error || 'فشل إنشاء العرض';
                        return of(QuotesActions.createQuoteFailure({ error: msg }));
                    })
                )
            )
        )
    )

    sendQuote$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.sendQuote),
            mergeMap(({ quoteId }) =>
                this._HttpClient.post<{ message: string, token: string }>(
                    `${this.API_URL}/${quoteId}/send`, {}
                ).pipe(
                    map((res) => QuotesActions.sendQuoteSuccess({ quoteId, token: res.token })),
                    tap(() => this._ToastService.show('تم إرسال العرض، شارك اللينك مع العميل', 'success')),
                    catchError((error) => {
                        const msg = error.error?.message || 'فشل إرسال العرض';
                        return of(QuotesActions.sendQuoteFailure({ error: msg }));
                    })
                )
            )
        )
    )

    updateStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.updateQuote),
            mergeMap(({ quoteId, newStatus }) =>
                this._HttpClient.patch(`${this.API_URL}/${quoteId}/status`, { newStatus }).pipe(
                    map(() => QuotesActions.updateStatusSuccess({ quoteId, newStatus: mapStatusToLabel(newStatus) })),
                    catchError((error) => of(QuotesActions.updateStatusFailure({ error: error.error ?? 'فشل التحديث' })))))
        )
    )

    showError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.loadQuotesFailure, QuotesActions.createQuoteFailure, QuotesActions.updateStatusFailure, QuotesActions.sendQuoteFailure),
            tap(({ error }) => this._ToastService.show(error, 'error'))
        ),
        { dispatch: false }
    )

    deleteQuotes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(QuotesActions.deleteQuote),
            mergeMap(({ quoteId }) =>
                this._HttpClient.delete(`${this.API_URL}/${quoteId}`).pipe(
                    map(() => QuotesActions.deleteQuoteSuccess({ quoteId })),
                    catchError(() =>
                        of(QuotesActions.deleteQuoteFailure({ error: 'فشل حذف العرض' }))
                    )
                )
            )
        )
    )
}

function mapStatusToLabel(status: number): string {
    const labels: Record<number, string> = { 1: 'Draft', 2: 'Sent', 3: 'Accepted', 4: 'Rejected', 5: 'Invoiced' };
    return labels[status] ?? 'Draft';
}