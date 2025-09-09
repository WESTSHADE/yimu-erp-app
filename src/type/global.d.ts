declare namespace GLOBAL {
    type request = {
        page?: number;
        pageSize?: number;
        searchParams?: string;
    };
    type shipping = {
        firstName: string;
        lastName: string;
        company: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
        email: string;
        phone: string;
    };

    type meta = {
        pagination: {
            page: number;
            pageSize: number;
            pageCount?: number;
            total: number;
            draft?: number;
            private?: number;
            publish?: number;
            warnCount?: number;
        };
    };
}
