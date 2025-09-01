import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
// 工具函数：UTC时间转本地显示
export const formatToLocalTime = (utcString: string, formatStr = "MMM DD, YYYY HH:mm") => {
    return dayjs.utc(utcString).local().format(formatStr);
};

// 工具函数：本地时间转UTC
export const convertToUTC = (localDate: Date | string) => {
    return dayjs(localDate).utc().format();
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
