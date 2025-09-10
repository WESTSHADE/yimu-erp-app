declare namespace PROD {
    type topProducts = {
        id: number;
        name: string;
        netSales: number;
        sold: number;
        product: ORDERS.product;
    };

    type searchOption = {
        reset: boolean = true;
        start: string;
        end: string;
        search: string;
    };
}
