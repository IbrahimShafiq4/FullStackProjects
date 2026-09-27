import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IQuotes } from './quotes.model';

export const QuotesActions = createActionGroup({
    source: 'IQuotes',
    events: {
        'Load Quotes':              emptyProps(),
        'Load Quotes Success':      props<{ quotes: IQuotes[] }>(),
        'Load Quotes Failure':      props<{ error: string }>(),

        'Create Quote':             props<{ quoteData: any }>(),
        'Create Quote Success':     props<{ quote: IQuotes }>(),
        'Create Quote Failure':     props<{ error: string }>(),

        'Send Quote':               props<{ quoteId: number }>(),
        'Send Quote Success':       props<{ quoteId: number, token: string }>(),
        'Send Quote Failure':       props<{ error: string }>(),

        'Update Quote':             props<{ quoteId: number, newStatus: number }>(),
        'Update Status Success':    props<{ quoteId: number, newStatus: string }>(),
        'Update Status Failure':    props<{ error: string }>(),

        'Delete Quote':             props<{ quoteId: number }>(),
        'Delete Quote Success':     props<{ quoteId: number }>(),
        'Delete Quote Failure':     props<{ error: string }>(),
    }
})