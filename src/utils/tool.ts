import { Toast } from "@arco-design/mobile-react";

// 扩展 Window 接口
declare global {
    interface Window {
        toastInstance?: any;
    }
}

/**
 * 计算两个值的百分比关系
 * @param currentValue
 * @param comparisonValue
 * @returns
 */
export function calculatePercentage(currentValue: number, comparisonValue: number): string {
    if (currentValue === 0 && comparisonValue === 0) {
        return "0";
    } else if (currentValue === comparisonValue) {
        return "0";
    } else if (currentValue === 0 && comparisonValue !== 0) {
        return "100";
    } else if (currentValue !== 0 && comparisonValue === 0) {
        return "100";
    } else {
        // 处理其他情况，例如计算百分比变化,取整
        const percentageChange = Math.abs(((currentValue - comparisonValue) / comparisonValue) * 100);
        return percentageChange.toFixed(2);
    }
}

/**
 * 轻提示
 * @param  {"show" | "success" | "error" | "loading" | "info"} [func] - 提示类型
 * @param {any} [options] - 传参
 * @returns
 */
export const toast = (func: "show" | "success" | "error" | "loading" | "info", options?: any) => {
    if (window.toastInstance) {
        window.toastInstance.close();
    }
    window.toastInstance = (Toast as any)[func](options);
};
