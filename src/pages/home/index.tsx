import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import { Card, Grid, List, Button as PCButton, Table, TableColumnProps, Descriptions } from "@arco-design/web-react";
import { REALTIME_STATISTICS_LIST } from "../../constant/home";
import { IconCheckCircle, IconClockCircle, IconFilter, IconLeft, IconRight, IconCloseCircle, IconInfoCircle, IconLoading, IconStop, IconPlus } from "@arco-design/web-react/icon";
// utils
import { Dayjs } from "dayjs";
import { calculatePercentage } from "../../utils/tool";
import { pacificTime } from "../../utils/dayjs";
import { formatMoney, formatToLocalTime } from "../../utils/format";
// api
import { getOverviewMobile, getOverviewOrders } from "../../api/home";
// css
import "../home/index.css";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";

const { Row, Col } = Grid;
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
    pending: (
        <span style={{ color: "#FF7D00" }}>
            <IconInfoCircle style={{ marginRight: 6, verticalAlign: "middle" }} />
            Pending
        </span>
    ),
    processing: (
        <span style={{ color: "#072CA6" }}>
            <IconClockCircle style={{ marginRight: 6, verticalAlign: "middle" }} />
            Processing
        </span>
    ),
    "partial-shipped": (
        <span style={{ color: "#4080FF" }}>
            <IconLoading style={{ marginRight: 6, animation: "none", verticalAlign: "middle" }} />
            Partially Shipped
        </span>
    ),
    shipped: (
        <span style={{ color: "#009A29" }}>
            <IconCheckCircle style={{ marginRight: 6, verticalAlign: "middle" }} />
            Shipped
        </span>
    ),
    cancelled: (
        <span style={{ color: "#86909C" }}>
            <IconCloseCircle style={{ marginRight: 6, verticalAlign: "middle" }} />
            Cancelled
        </span>
    ),
    refunded: (
        <span style={{ color: "#8547DA" }}>
            <IconStop style={{ marginRight: 6, verticalAlign: "middle" }} />
            Refunded
        </span>
    ),
};
const initRealTime: HOME.ordersTotals = {
    netSales: 0,
    orders: 0,
    averageOrderValue: 0,
    adsSpending: 0,
    adsPercentage: 0,
};
const Home = () => {
    const navigate = useNavigate();
    const [overviewList, setOverviewList] = useState<HOME.overview[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Dayjs | undefined, Dayjs | undefined]>([undefined, undefined]);
    const [comparisonRange, setComparisonRange] = useState<[Dayjs | undefined, Dayjs | undefined]>([undefined, undefined]);
    const [currentRealTime, setCurrentRealTime] = useState<HOME.ordersTotals>(initRealTime);
    const [compareRealTime, setCompareRealTime] = useState<HOME.ordersTotals>(initRealTime);
    const [ordersList, setOrdersList] = useState<ORDERS.order[]>([]);
    const handleShowChange = () => {
        setShowDropdown(!showDropdown);
    };
    const returnTableMap = (record: HOME.overview, key: "netSales" | "orderCount" | "avgOrderValue") => {
        if (["netSales", "orderCount", "avgOrderValue"].includes(key)) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1D2129",
                        }}
                    >
                        {`$${record[key].value}`}
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            color: "#86909C",
                        }}
                    >
                        {`$${record[key].period}`}
                    </div>
                    <div
                        style={{
                            fontWeight: 400,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                height: "14px",
                                verticalAlign: "center",
                                alignItems: "center",
                                color: Number(record[key].vs) > 0 ? "#009A29" : "#CB272D",
                            }}
                        >
                            <IconPlus style={{ color: Number(record[key].vs) > 0 ? "#009A29" : "#CB272D", fontSize: 10 }} />
                            <div style={{ fontSize: 10 }}>{Math.abs(Number(record[key].vs)) + "%"}</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const columns: TableColumnProps[] = [
        {
            title: "",
            dataIndex: "name",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
                width: "28px",
            },
            bodyCellStyle: {
                backgroundColor: "#E8F3FF",
            },
        },
        {
            title: "NS",
            dataIndex: "NS",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
            },
            bodyCellStyle: {
                padding: "4px",
            },
            render: (value: string, record: HOME.overview) => {
                return returnTableMap(record, "netSales");
            },
        },
        {
            title: "OD",
            dataIndex: "OD",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
            },
            render: (value: string, record: HOME.overview) => {
                return returnTableMap(record, "orderCount");
            },
        },
        {
            title: "AOV",
            dataIndex: "AOV",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
            },
            render: (value: string, record: HOME.overview) => {
                return returnTableMap(record, "avgOrderValue");
            },
        },
        {
            title: "AS",
            dataIndex: "adsSpending",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
            },
        },
        {
            title: "AP",
            dataIndex: "adsPercentage",
            headerCellStyle: {
                backgroundColor: "#E8F3FF",
            },
        },
    ];

    const getOrdersList = async () => {
        const startTime = pacificTime(dateRange[0] || pacificTime())
            .startOf("day")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const endDate = pacificTime(dateRange[1] || pacificTime())
            .endOf("day")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const compareStartTime = pacificTime(comparisonRange[0]).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const compareEndDate = pacificTime(comparisonRange[1]).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        await getOverviewOrders(startTime, endDate, 1, 8).then((res) => {
            setOrdersList(res.dateSummary);
            setCurrentRealTime(res.totals);
        });
        await getOverviewOrders(compareStartTime, compareEndDate, 1, 8).then((res) => {
            setCompareRealTime(res.totals);
        });
    };

    const getOverviewMobileData = async () => {
        await getOverviewMobile().then((res) => {
            if (res) {
                const data = Object.entries(res).map((item: [string, HOME.itemData]) => {
                    let info: HOME.overview = {
                        name: "",
                        ...item[1],
                    };
                    if (item[0] == "today") info["name"] = "T";
                    if (item[0] == "week") info["name"] = "W";
                    if (item[0] == "month") info["name"] = "M";
                    if (item[0] == "year") info["name"] = "Y";
                    return info;
                });
                setOverviewList(data);
            }
        });
    };

    useEffect(() => {
        getOrdersList();
        getOverviewMobileData();
    }, []);

    return (
        <div>
            <div style={{ padding: 16 }}>
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 12,
                    }}
                >
                    Overview
                </div>
                <div className="homeTable">
                    <Table rowKey="name" columns={columns} data={overviewList} size="small" border borderCell pagination={false} />
                </div>
            </div>
            <Sticky topOffset={0} getScrollContainer={() => document.getElementById("main-scroll-container") || window}>
                <div
                    style={{
                        height: 22,
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* <SearchBar
                        prefix={null}
                        style={{ padding: 0, flex: 1, height: 32 }}
                        actionButton={
                            <MobileButton
                                needActive
                                style={{
                                    width: 77,
                                    height: 32,
                                    fontSize: 14,
                                }}
                            >
                                Search
                            </MobileButton>
                        }
                    /> */}
                    <div
                        style={{
                            color: "#1D2129",
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        {dateRange[0] ? `${dateRange[0]}-${dateRange[1]}` : `Today ${pacificTime().format("MM-DD-YYYY")}`}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <IconLeft />
                        <IconRight style={{}} />
                        <IconFilter
                            style={{ fontSize: 20, marginLeft: 10 }}
                            onClick={() => {
                                setShowDropdown(true);
                            }}
                        />
                        <Dropdown showDropdown={showDropdown} onOptionChange={handleShowChange} onCancel={() => setShowDropdown(false)} preventBodyScroll={true}>
                            <Card
                                style={{
                                    marginTop: "16px",
                                    borderTop: "1px solid #F2F3F5",
                                }}
                                bordered={false}
                            >
                                <div
                                    style={{
                                        color: "#1D2129",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                >
                                    Payment Date
                                </div>
                            </Card>
                        </Dropdown>
                    </div>
                </div>
            </Sticky>
            <div
                style={{
                    padding: 16,
                }}
            >
                <Card bordered={false}>
                    <Row
                        gutter={[12, 16]}
                        style={{
                            display: "flex",
                            alignItems: "stretch",
                        }}
                    >
                        {REALTIME_STATISTICS_LIST.map((item) => {
                            return (
                                <Col span={item.span} key={item.key}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            backgroundColor: `${item.color}`,
                                        }}
                                        bodyStyle={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div style={{ color: "#1D2129", fontWeight: 500 }}>{item.title}</div>

                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <div style={{ color: "#1D2129", fontWeight: 500, fontSize: 22 }}>
                                                    {item.type == "$" ? formatMoney(currentRealTime[item.key] || 0) : currentRealTime[item.key] || 0}
                                                </div>
                                                <div>{calculatePercentage(Number(currentRealTime[item.key] || 0), Number(compareRealTime[item.key]) || 0)}</div>
                                            </div>
                                            <div style={{ color: "#86909C", fontSize: 14 }}>{item.type == "$" ? formatMoney(currentRealTime[item.key] || 0) : currentRealTime[item.key] || 0}</div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>
            </div>
            <div style={{ padding: "0 16px" }}>
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    Most Recent Orders
                </div>
                <Card style={{ margin: "12px 0 16px 0" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
                    <List
                        bordered={false}
                        size={"small"}
                        header={null}
                        dataSource={ordersList}
                        render={(item, index) => {
                            const orderData: DataType = [
                                { label: "Payment Date", value: item.paymentTime ? formatToLocalTime(item.paymentTime, "MM-DD-YYYY HH:mm:ss") : "" },
                                { label: "Status", value: StatusMap[item.status as ORDERS.OrderStatus] ? StatusMap[item.status as ORDERS.OrderStatus] : <></> },
                            ];
                            return (
                                <List.Item
                                    key={index}
                                    style={{
                                        padding: "12px 0",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <div>{`WS${item.id} ${item?.shipping?.firstName || ""} ${item?.shipping?.lastName || ""}`}</div>
                                                <div>{formatMoney(item.total, 2)}</div>
                                            </div>
                                            <Descriptions
                                                data={orderData}
                                                column={1}
                                                labelStyle={{
                                                    paddingBottom: "4px",
                                                    height: 22,
                                                    color: "#86909C",
                                                    fontWeight: 400,
                                                }}
                                                valueStyle={{
                                                    paddingBottom: "4px",
                                                    textAlign: "right",
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#C9CDD4" }}>
                                            <IconArrowIn />
                                        </div>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                    <div style={{ display: "flex", height: "max-content", justifyContent: "flex-end", borderTop: "1px solid #E5E6EB" }}>
                        <PCButton
                            type="text"
                            style={{ margin: "5px 0", padding: 0, backgroundColor: "transparent" }}
                            onClick={() => {
                                navigate("/orders");
                            }}
                        >
                            View all Orders
                        </PCButton>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Home;
