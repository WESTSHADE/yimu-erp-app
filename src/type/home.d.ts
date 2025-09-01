declare namespace HOME {
    type overview = {
        name: string;
        netSales: number;
        orders: number;
        averageOrderValue: number;
        adsSpending: number;
        adsPercentage: number;
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
