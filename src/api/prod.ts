import request from "../utils/request";
/**
 * overview-orders数据
 * @param code
 * @returns
 */
export const getOverviewProduct = (
    startTime: string,
    endTime: string,
    rankLimit: number
): Promise<{
    rankings: {
        topProducts: PROD.topProducts[];
    };
}> => {
    return request.get(`/generate-overviewV2?start=${startTime}&end=${endTime}&timeGranularity=day&rankLimit=${rankLimit}`);
};
