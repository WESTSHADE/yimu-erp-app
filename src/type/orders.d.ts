declare namespace ORDERS {
    /** 订单状态 */
    type OrderStatus = "pending" | "processing" | "partial-shipped" | "shipped" | "cancelled" | "refunded";

    /** 最新订单条目 */
    type MostRecentOrders = {
        id: number;
        firstName: string;
        lastName: string;
        paymentDate: string;
        status: string;
        total: number;
        billing: shipping;
        shipping: shipping;
    };
}
