import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IQuotesState } from "./quotes.state";

export const selectQuotesState = createFeatureSelector<IQuotesState>('quotes');

export const selectAllQuotes = createSelector(selectQuotesState, (state) => state.quotes)
export const selectQuotesLoading = createSelector(selectQuotesState, (state) => state.loading);

export const selectTotalRevenue = createSelector(selectAllQuotes, (quotes) => 
    quotes.filter((q) => q.status === 'Invoiced').reduce((sum , q) => sum + q.total, 0)
)

export const selectQuotesByState = (status: string) => 
    createSelector(selectAllQuotes, (quotes) => quotes.filter((q) => q.status === status))