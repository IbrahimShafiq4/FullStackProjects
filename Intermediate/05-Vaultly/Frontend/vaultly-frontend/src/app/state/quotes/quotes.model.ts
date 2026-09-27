export interface ILineItem {
    id:             number;
    description:    string;
    unitPrice:      number;
    quantity:       number;
    subtotal:       number;
}

export interface IQuotes {
    id:             number;
    clientName:     string;
    clientEmail:    string;
    status:         string;
    taxType:        string;
    subtotal:       number;
    tax:            number;
    total:          number;
    publicToken:    string | null;
}

export interface IPublicQuoteLineItem {
    description:    string;
    unitPrice:      number;
    quantity:       number;
    subtotal:       number;
}

export interface IPublicQuote {
    freelancerName: string;
    clientName:     string;
    clientEmail:    string;
    status:         string;
    taxType:        string;
    createdAt:      string;
    sentAt:         string | null;
    clientNote:     string | null;
    lineItems:      IPublicQuoteLineItem[];
    subtotal:       number;
    tax:            number;
    total:          number;
}