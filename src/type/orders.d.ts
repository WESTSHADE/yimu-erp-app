declare namespace ORDERS {
    /** 订单状态 */
    type OrderStatus = "pending" | "processing" | "partial-shipped" | "shipped" | "cancelled" | "refunded";
    /** 最新订单条目 */
    type product = {
        name: string;
    };
    type variation = {
        sku: string;
        product: product;
    };
    type order = {
        id: number;
        firstName: string;
        lastName: string;
        paymentDate: string;
        status: string;
        total: number;
        billing: shipping;
        shipping: shipping;
        paymentTime: string;
        customerType: string;
        subtotal: number;
        discount: number;
        coupons: {
            code: string;
        }[];
        items: {
            product?: product;
            variation?: variation;
        }[];
    };
    type searchOption = {
        reset: boolean = true;
        page: number;
        pageSize: number;
        status: string;
    };
}
