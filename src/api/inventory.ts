import request from "../utils/request";

/**
 * 获取composite列表
 * @param params
 * @returns
 */
export const getComposites = (
    params?: GLOBAL.request
): Promise<{
    data: Inventory.composite[];
    meta: GLOBAL.meta;
}> => {
    const { searchParams = "" } = params || {};
    return request.get(`/composite-product-costs?${searchParams}`);
};

/**
 * 出库业务流接口
 * @param id
 * @returns
 */
export const waitingDeliveriesOutbounds = async (searchParams: string) => {
    return request.get(`/waiting-deliveries-outbounds?${searchParams ? searchParams : ""}`);
};
