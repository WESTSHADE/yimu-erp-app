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
