import { createReducer, on } from "@ngrx/store";
import { QuotesActions } from "./quotes.actions";
import { intialQuotesState } from "./quotes.state";
import { IQuotes } from "./quotes.model";

export const quotesReducer = createReducer(
    intialQuotesState,

    on(QuotesActions.loadQuotes, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(QuotesActions.loadQuotesSuccess, (state, { quotes }) => ({
        ...state,
        loading: false,
        error: null
    })),

    on(QuotesActions.loadQuotesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(QuotesActions.createQuoteSuccess, (state, { quote }) => ({
        ...state,
        quotes: [quote, ...state.quotes]
    })),

    on(QuotesActions.updateStatusSuccess, (state, { quoteId, newStatus }) => ({
        ...state,
        quotes: state.quotes.map((q: IQuotes) => q.id === quoteId ? { ...q, status: newStatus } : q)
    })),

    on(QuotesActions.deleteQuote, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(QuotesActions.deleteQuoteSuccess, (state, { quoteId }) => ({
        ...state,
        quotes: state.quotes.filter(q => q.id !== quoteId),
        loading: false,
        error: null,
    })),

    on(QuotesActions.deleteQuoteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
)