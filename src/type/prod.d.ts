declare namespace PROD {
    type topProducts = {
        id: number;
        name: string;
        netSales: number;
        sold: number;
        product: ORDERS.product;
    };
    type compareTopProducts = {
        id: number;
        name: string;
        netSales1: number;
        sold1: number;
        product: ORDERS.product;
        netSales2?: number;
        sold2?: number;
    };

    type searchOption = {
        reset: boolean = true;
        start: string;
        end: string;
        search: string;
    };
}
