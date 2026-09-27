export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urget';
export type TicketCategory = 'Technical' | 'Billing' | 'Bug' | 'Feature' | 'Other';

export interface ITicket {
    id: number;
    subject: string;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    tags: string | null;
    createdAt: string;
    updatedAt: string | null;
    resolvedAt: string | null;
    slaDeadline: string;
    isOverdue: boolean;
    isNearingDeadline: boolean;
    customerName: string;
    assignedAgentId: string | null;
    assignedAgentName: string | null;
    messageCount: number;
    noteCount: number;
}

export interface ITicketFilter {
    search?: string;
    status?: TicketStatus | '';
    priority?: TicketPriority | '';
    category?: TicketCategory | '';
    assignedToMe?: boolean;
    unassigned?: boolean;
    overdue?: boolean;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    pageSize?: number;
}

export interface IPagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface IDailyCount { date: string; created: number; resolved: number; }
export interface ICategoryCount { category: string; count: number; }
export interface IPriorityCount { priority: string; count: number; }

export interface ITicketStats {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    overdue: number;
    nearingDeadline: number;
    unassigned: number;
    assignedToMe: number;
    avgResolutionHours: number;
    slaComplianceRate: number;
    lastSevenDays: IDailyCount[];
    byCategory: ICategoryCount[];
    byPriority: IPriorityCount[];
}

export interface ITicketNote {
    id: number;
    content: string;
    createdAt: string;
    authorName: string;
}

export interface IAgent {
    id: string;
    fullName: string;
}

export interface IProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    ticketsCreated: number;
    ticketsAssigned: number;
    ticketsResolved: number;
    joinedAt: string;
}