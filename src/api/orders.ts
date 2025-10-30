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
  data: ORDERS.order[];
  totals: HOME.ordersTotals;
}> => {
  return request.get(
    `/orders?sort[0]=paymentTime:desc&sort[1]=createdAt:desc&filters[createdAt][$gte]=${startTime}&filters[createdAt][$lte]=${endTime}&pagination[page]=${page}&pagination[pageSize]=${pageSize}${searchParams}`
  );
};

/**
 * 获取 用户类型
 * @param pageSize
 * @param page
 * @param searchParams
 * @returns
 */
export const getCustomerType = (
  email: string,
  customerName: string
): Promise<{
  data: ORDERS.customer[];
}> => {
  return request.get(
    `/customers?filters[email][$eq]=${email}&filters[customerName][$eq]=${customerName}`
  );
};
