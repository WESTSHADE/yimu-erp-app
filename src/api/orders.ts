import request from "../utils/request";

/**
 * 获取 orders 列表
 * @param pageSize
 * @param page
 * @param searchParams
 * @returns
 */
export const getOrders = (
    startTime: string,
    endTime: string,
    page: number,
    pageSize: number,
    searchParams: string
): Promise<{
    dataSummary: ORDERS.order[];
    totals: HOME.ordersTotals;
}> => {
    return request.get(`/generate-overview-ordersV2?sort[0]=createdAt:desc&start=${startTime}&end=${endTime}&timeGranularity=day&page=${page}&pageSize=${pageSize}${searchParams}`);
};
