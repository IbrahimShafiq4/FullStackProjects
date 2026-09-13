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
}
