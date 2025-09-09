import request from "../utils/request";
/**
 * 用户登录
 * @param code
 * @returns
 */
export const login = (
    code: string,
    state: string
): Promise<{
    data: {
        token: string;
        exp: number;
    };
}> => {
    return request.get("/login", { params: { code, state } });
};

/**
 * overview数据
 * @param code
 * @returns
 */
export const getOverviewMobile = (): Promise<HOME.response_overview> => {
    return request.get("/generate-overview-mobile-home");
};

/**
 * overview-orders数据
 * @param code
 * @returns
 */
export const getOverviewOrders = (
    startTime: string,
    endTime: string,
    page: number,
    pageSize: number
): Promise<{
    dateSummary: ORDERS.order[];
    totals: HOME.ordersTotals;
}> => {
    return request.get(`/generate-overview-ordersV2?start=${startTime}&end=${endTime}&timeGranularity=day&page=${page}&pageSize=${pageSize}`);
};
