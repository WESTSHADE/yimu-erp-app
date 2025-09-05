import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

// 扩展 dayjs 插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

// 创建太平洋时间的 dayjs 实例，具有所有 dayjs 功能但基础时间是太平洋时间
export const pacificTime = (date?: Date | string | dayjs.Dayjs | number, format?: string, strict?: boolean) => {
    if (date === undefined) {
        return dayjs().tz("America/Los_Angeles");
    }
    if (format) {
        return dayjs(date, format, strict).tz("America/Los_Angeles");
    }
    return dayjs(date).tz("America/Los_Angeles");
};

pacificTime.unix = (timestamp: number) => {
    return dayjs.unix(timestamp).tz("America/Los_Angeles");
};

pacificTime.tz = Object.assign(
    (date?: Date | string | dayjs.Dayjs | number, timezone?: string) => {
        return dayjs.tz(date, timezone || "America/Los_Angeles");
    },
    {
        guess: dayjs.tz.guess,
    }
);

// 添加其他常用的静态方法
pacificTime.isDayjs = dayjs.isDayjs;
pacificTime.locale = dayjs.locale;
pacificTime.extend = dayjs.extend;
