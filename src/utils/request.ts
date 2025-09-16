import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { Toast } from "@arco-design/mobile-react";

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig): InternalAxiosRequestConfig => {
        // 确保 headers 存在
        if (!config.headers) {
            config.headers = {};
        }
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            const user = localStorage.getItem("user");
            if (token && user) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config as InternalAxiosRequestConfig; // 强制类型转换
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error: AxiosError | any) => {
        if (error.response) {
            console.error("Error response:", error.response.data);
            // 根据状态码进行路由跳转
            if (error.response.status === 401) {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                }
            } else if (error.response.status === 403) {
                if (typeof window !== "undefined") {
                    // window.location.href = "/403";
                    Toast.error("Sorry, you are not authorized");
                }
            }

            if (error.response?.data?.error?.details?.errors) {
                if (error.response?.data.error.message === "This attribute must be unique") {
                    Toast.error(`This ${error.response?.data?.error?.details?.errors[0].path.join(",")} must be unique`);
                } else {
                    Toast.error(`${error.response?.data?.error?.details?.errors[0].message}`);
                }
            } else {
                Toast.error(error.response?.data.error.name);
            }
        } else {
            console.error("Error message:", error.message);
        }
        return Promise.reject(error);
    }
);

function buildQueryString(params: Record<string, any>): string {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map((k) => (params[k] !== undefined && params[k] !== null ? `${esc(k)}=${esc(params[k])}` : ""))
        .filter(Boolean)
        .join("&");
}

const request = axiosInstance as AxiosInstance & {
    getWithParams: <T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => Promise<T>;
};

request.getWithParams = <T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> => {
    let finalUrl = url;
    if (params && Object.keys(params).length > 0) {
        const queryString = buildQueryString(params);
        finalUrl += (url.includes("?") ? "&" : "?") + queryString;
    }
    return axiosInstance.get<T>(finalUrl, config) as Promise<T>;
};

export default request;
