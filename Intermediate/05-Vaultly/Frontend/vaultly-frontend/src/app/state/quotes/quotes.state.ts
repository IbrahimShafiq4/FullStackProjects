import { IQuotes } from "./quotes.model";

export interface IQuotesState {
    quotes: IQuotes[];
    loading: boolean;
    error: string | null;
}

export const intialQuotesState: IQuotesState = {
    quotes: [],
    loading: false,
    error: null
}