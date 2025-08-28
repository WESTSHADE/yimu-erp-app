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
