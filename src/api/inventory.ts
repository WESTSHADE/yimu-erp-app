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
}> => {
    const { searchParams = "" } = params || {};
    return request.get(`/composite-product-costs?${searchParams}`);
};
