import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
// 工具函数：UTC时间转本地显示
export const formatToLocalTime = (utcString: string, formatStr = "MMM DD, YYYY HH:mm") => {
    return dayjs.utc(utcString).local().format(formatStr);
};

/**
 * 格式化money,传入number或者string，返回美元$格式
 * @param value
 * @returns
 */
export const formatMoney = (value: number | string, fixed?: 2) => {
    let number = parseFloat(value as string);

    if (isNaN(number)) {
        return "Invalid number";
    }
    if (number == 0) {
        return "$0.00";
    }
    return number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: fixed ? fixed : number % 1 === 0 ? 0 : 2,
    });
};

export const formatRoundingAmount = (amount: number, fixed?: 2) => {
    // 1. 验证输入是否为有效数字
    const num = amount;
    if (isNaN(num)) return "$0.00";

    const absAmount = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    // 2. 处理大于等于1000的金额
    if (absAmount >= 1000) {
        const kValue = absAmount / 1000;
        // 使用 Intl.NumberFormat 格式化千位符和美元符号
        return (
            sign +
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(kValue) +
            "k"
        );
    }

    // 3. 处理小于1000的金额
    return (
        sign +
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(absAmount)
    );
};
