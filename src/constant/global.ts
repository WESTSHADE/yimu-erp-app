import { pacificTime } from "../utils/dayjs";
export const TIME_SELECTION = [
    {
        label: "7 days",
        key: "7",
        value: [pacificTime(), pacificTime().subtract(6, "day")],
    },
    {
        label: "30 days",
        key: "30",
        value: [pacificTime(), pacificTime().subtract(29, "day")],
    },
    {
        label: "90 days",
        key: "90",
        value: [pacificTime(), pacificTime().subtract(89, "day")],
    },
];

export const filterValueInit = {
    timeSelect: "",
    startTime: undefined,
    endTime: undefined,
    singleTime: pacificTime().valueOf(),
    sortType: "sold",
    compareType: "single",
    dateRange: [undefined, undefined] as [number | undefined, number | undefined],
    compareRange: [undefined, undefined] as [number | undefined, number | undefined],
};
