export const REALTIME_STATISTICS_LIST: {
    title: string;
    key: HOME.dataType;
    type: "$" | "";
    span: number;
    color: string;
}[] = [
    {
        title: "Net Sales",
        key: "netSales",
        type: "$",
        span: 24,
        color: "#FFF6E9",
    },
    {
        title: "Orders",
        key: "orders",
        type: "",
        span: 12,
        color: "#F4FDF5",
    },
    {
        title: "Average Order Value",
        key: "averageOrderValue",
        type: "$",
        span: 12,
        color: "#F2FBFD",
    },
    {
        title: "Ads Spending",
        key: "adsSpending",
        type: "$",
        span: 12,
        color: "#FFF3F0",
    },
    {
        title: "Ads Percentage",
        key: "adsPercentage",
        type: "",
        span: 12,
        color: "#F8F8F8",
    },
];
