export interface Settings {
    account?: {
        actor: string;
        permission: string;
    };
    config?: {
        atomic_url: string;
        chain_url: string;
        marketplace_url: string;
        profile_url: string;
        chain: string;
        collection?: string;
        query?: {
            page?: string;
            category?: string;
            search?: string;
        };
    };
    transactionId?: string;
    pack: null | any;
}

export interface Payload {
    success: boolean;
    message?: string;
    data?: any[] | any;
    query_time: number;
}

export interface TransactionAction {
    account: string;
    name: string;
    authorization: TransactionActionAuthorization[];
    data: {
        sale_id?: string | null;
        [key: string]: unknown;
    };
    hex_data?: string;
}

export interface TransactionActionAuthorization {
    actor: string;
    permission: string;
}
