import request from "../utils/request";

/**
 * 获取 orders 列表
 * @param pageSize
 * @param page
 * @param searchParams
 * @returns
 */
export const getOrders = ({ pageSize, page, searchParams = "" }: GLOBAL.request): Promise<{ data: ORDERS.MostRecentOrders[] }> => {
    if (page && pageSize) {
        return request.get(`/orders?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=createdAt:desc${searchParams}`);
    } else {
        return request.get(`/orders?sort[0]=createdAt:desc${searchParams}`);
    }
};
