export enum ItemType {
    Found = 'Found',
    Lost = 'Lost'
}

export enum ItemStatus {
    Open = 'Open',
    Matched = 'Matched',
    Closed = 'Closed'
}

export interface Item {
    id: number;
    title: string;
    description: string;
    category: string;
    imageUrl: string | null;
    location: string;
    type: ItemType;
    status: ItemStatus;
    createdAt: string;
    createdByDisplayName: string;
}