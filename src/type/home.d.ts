declare namespace HOME {
    type itemData = {
        avgOrderValue: {
            period: string;
            value: string;
            vs: string;
        };
        netSales: {
            period: string;
            value: string;
            vs: string;
        };
        orderCount: {
            period: string;
            value: string;
            vs: string;
        };
    };

    type response_overview = {
        month: itemData;
        today: itemData;
        week: itemData;
        year: itemData;
    };

    type overview = {
        name: string;
        netSales: {
            period: string;
            value: string;
            vs: string;
        };
        orderCount: {
            period: string;
            value: string;
            vs: string;
        };
        avgOrderValue: {
            period: string;
            value: string;
            vs: string;
        };
        adsSpending?: number;
        adsPercentage?: number;
    };
    type realTime = {
        netSales: number;
        orders: number;
        averageOrderValue: number;
        adsSpending: number;
        adsPercentage: number;
    };

    type dataType = "netSales" | "orders" | "averageOrderValue" | "adsSpending" | "adsPercentage";
}
