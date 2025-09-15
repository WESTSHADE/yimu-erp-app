import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import { Card, Grid, List, Button as PCButton, Spin, Table, TableColumnProps, Descriptions } from "@arco-design/web-react";
import { REALTIME_STATISTICS_LIST } from "../../constant/home";
import { IconCheckCircle, IconClockCircle, IconFilter, IconLeft, IconRight, IconCloseCircle, IconInfoCircle, IconLoading, IconStop, IconPlus, IconMinus } from "@arco-design/web-react/icon";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
// utils
import { calculatePercentage } from "../../utils/tool";
import { pacificTime } from "../../utils/dayjs";
import { formatRoundingAmount, formatMoney, formatToLocalTime } from "../../utils/format";
// api
import { getOverviewMobile, getOverviewOrders } from "../../api/home";
import { getOverviewProduct } from "../../api/prod";
// css
import "../home/index.css";
import SelectCustomize from "../../components/select-customize";
import { filterValueInit } from "../../constant/global";

const { Row, Col } = Grid;
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
    pending: (
        <div style={{ color: "#FF7D00", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconInfoCircle style={{ marginRight: 6, verticalAlign: "baseline", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Pending</span>
        </div>
    ),
    processing: (
        <div style={{ color: "#072CA6", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconClockCircle style={{ marginRight: 6, verticalAlign: "middle", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Processing</span>
        </div>
    ),
    "partial-shipped": (
        <div style={{ color: "#FF7D00", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconLoading style={{ marginRight: 6, animation: "none", verticalAlign: "middle", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Partially Shipped</span>
        </div>
    ),
    shipped: (
        <div style={{ color: "#FF7D00", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconCheckCircle style={{ marginRight: 6, verticalAlign: "middle", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Shipped</span>
        </div>
    ),
    cancelled: (
        <div style={{ color: "#FF7D00", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconCloseCircle style={{ marginRight: 6, verticalAlign: "middle", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Cancelled</span>
        </div>
    ),
    refunded: (
        <div style={{ color: "#FF7D00", height: 22, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <IconStop style={{ marginRight: 6, verticalAlign: "middle", fontSize: 12 }} />
            <span style={{ fontSize: 14 }}>Refunded</span>
        </div>
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
    const [filterValue, setFilterValue] = useState<GLOBAL.filterType>(filterValueInit);
    const [loading, setLoading] = useState<boolean>(false);
    const [topProductList, setTopProductList] = useState<PROD.topProducts[]>([]);
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
                                color: Number(record[key].vs) >= 0 ? "#009A29" : "#CB272D",
                            }}
                        >
                            {Number(record[key].vs) >= 0 ? <IconPlus style={{ color: "#009A29", fontSize: 10 }} /> : <IconMinus style={{ color: "#CB272D", fontSize: 10 }} />}
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

    const getOrdersList = async (filterValue: GLOBAL.filterType) => {
        setFilterValue(filterValue);
        const currentDate = filterValue.startTime
            ? filterValue.endTime
                ? [filterValue.startTime, filterValue.endTime]
                : [filterValue.startTime, filterValue.startTime]
            : [filterValue.singleTime, filterValue.singleTime];
        const daysDifference = pacificTime(currentDate[1]).endOf("day").diff(pacificTime(currentDate[0]).startOf("day"), "day") + 1;
        const compareDate = [pacificTime(currentDate[0]).subtract(daysDifference, "day"), pacificTime(currentDate[1]).subtract(daysDifference, "day")];
        const startTime = pacificTime(currentDate[0]).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const endDate = pacificTime(currentDate[1]).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const compareStartTime = pacificTime(compareDate[0]).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const compareEndDate = pacificTime(compareDate[1]).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        await getOverviewOrders(startTime, endDate, 1, 8).then((res) => {
            setOrdersList(res.dataSummary);
            setCurrentRealTime(res.totals);
        });
        await getOverviewOrders(compareStartTime, compareEndDate, 1, 5).then((res) => {
            setCompareRealTime(res.totals);
        });
        await getOverviewProduct(startTime, endDate, 8).then((res) => {
            setTopProductList(res.rankings.topProducts);
            setLoading(false);
        });
        setShowDropdown(false);
        setLoading(false);
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
        getOrdersList(filterValue);
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
                        height: 54,
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            color: "#1D2129",
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        {filterValue?.startTime && filterValue?.endTime
                            ? `Select: ${pacificTime(filterValue?.startTime).format("MM-DD-YYYY")},${pacificTime(filterValue?.endTime).format("MM-DD-YYYY")}`
                            : `${
                                  pacificTime().startOf("day").format("MM-DD-YYYY") ==
                                  pacificTime(filterValue?.startTime || filterValue.singleTime)
                                      .startOf("day")
                                      .format("MM-DD-YYYY")
                                      ? "Today "
                                      : ""
                              }${pacificTime(filterValue?.startTime || filterValue.singleTime).format("MM-DD-YYYY")}`}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {!filterValue?.endTime && (
                            <IconLeft
                                style={{
                                    color: "#4E5969",
                                }}
                                onClick={() => {
                                    const new_singleTime = pacificTime(filterValue?.startTime || filterValue.singleTime)
                                        .subtract(1, "day")
                                        .valueOf();
                                    setFilterValue({ ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                    getOrdersList({ ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                }}
                            />
                        )}
                        {!filterValue?.endTime && (
                            <IconRight
                                style={{
                                    color:
                                        pacificTime(filterValue.startTime || filterValue.singleTime)
                                            .startOf("day")
                                            .valueOf() < pacificTime().startOf("day").valueOf()
                                            ? "#4E5969"
                                            : "#4E59694D",
                                }}
                                onClick={() => {
                                    if (
                                        pacificTime(filterValue.startTime || filterValue.singleTime)
                                            .startOf("day")
                                            .valueOf() < pacificTime().startOf("day").valueOf()
                                    ) {
                                        const new_singleTime = pacificTime(filterValue?.startTime || filterValue.singleTime)
                                            .add(1, "day")
                                            .valueOf();
                                        setFilterValue({ ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                        getOrdersList({ ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                    }
                                }}
                            />
                        )}
                        <IconFilter
                            style={{ fontSize: 20, marginLeft: 10, color: "#4E5969" }}
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                            }}
                        />
                        <Dropdown
                            clickOtherToClose={true}
                            isStopTouchEl={(target) => {
                                const selectNode = document.querySelector(".select-customize");
                                return selectNode?.contains(target) as boolean;
                            }}
                            showDropdown={showDropdown}
                            onOptionChange={handleShowChange}
                            onCancel={() => setShowDropdown(false)}
                        >
                            <SelectCustomize filterValue={filterValue} setFilterValue={setFilterValue} handleConfirm={getOrdersList} pageType="home" />
                        </Dropdown>
                    </div>
                </div>
            </Sticky>
            <Spin
                loading={loading}
                style={{
                    display: "block",
                }}
            >
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
                                const difference: number = Number(currentRealTime[item.key] || 0) - Number(compareRealTime[item.key] || 0);

                                return (
                                    <Col span={item.span} key={item.key}>
                                        <Card
                                            bordered={false}
                                            style={{
                                                backgroundColor: `${item.color}`,
                                                height: "100%",
                                            }}
                                            bodyStyle={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                height: "100%",
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
                                                        {item.type == "$" ? formatRoundingAmount(currentRealTime[item.key] || 0) : currentRealTime[item.key] || 0}
                                                    </div>
                                                    <div>
                                                        {difference >= 0 ? (
                                                            <IconPlus style={{ color: "#009A29", fontSize: 10, verticalAlign: "middle" }} />
                                                        ) : (
                                                            <IconMinus style={{ color: "#CB272D", fontSize: 10, verticalAlign: "middle" }} />
                                                        )}
                                                        <span
                                                            style={{
                                                                color: difference >= 0 ? "#009A29" : "#CB272D",
                                                                marginLeft: 2,
                                                                fontSize: 10,
                                                            }}
                                                        >
                                                            {calculatePercentage(Number(currentRealTime[item.key] || 0), Number(compareRealTime[item.key]) || 0) + "%"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ color: "#86909C", fontSize: 14 }}>
                                                    {item.type == "$" ? formatRoundingAmount(compareRealTime[item.key] || 0) : compareRealTime[item.key] || 0}
                                                </div>
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
                                        onClick={() => {
                                            navigate("/orders/detail", {
                                                state: {
                                                    ordersDetail: item,
                                                    pageType: "home",
                                                },
                                            });
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        width: "100%",
                                                        justifyContent: "space-between",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    <div>{`WS${item.id} ${item?.shipping?.firstName || ""} ${item?.shipping?.lastName || ""}`}</div>
                                                    <div>{formatMoney(item.total)}</div>
                                                </div>
                                                <Descriptions
                                                    data={orderData}
                                                    column={1}
                                                    labelStyle={{
                                                        paddingBottom: "4px",
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
                <div style={{ padding: "0 16px" }}>
                    <div
                        style={{
                            color: "#1D2129",
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    >
                        Top products - Items sold
                    </div>
                    <Card style={{ margin: "12px 0 16px 0" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
                        <List
                            bordered={false}
                            size={"small"}
                            header={null}
                            dataSource={topProductList}
                            render={(item, index) => {
                                const data = item?.product?.variation || item?.product;
                                const productData: DataType = [
                                    {
                                        label: "Items Sold",
                                        value: item.sold,
                                    },
                                    {
                                        label: "Net Sales",
                                        value: formatMoney(item.netSales),
                                    },
                                ];
                                return (
                                    <List.Item
                                        key={index}
                                        style={{
                                            padding: "12px 0",
                                        }}
                                    >
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <img src={data?.image?.src || ""} alt={data?.image?.name || ""} width={40} height={40} />
                                            <div
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color: "#1D2129",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {item?.name}
                                                </div>
                                                <Descriptions
                                                    data={productData}
                                                    column={1}
                                                    style={{
                                                        width: "100%",
                                                    }}
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
                                    navigate("/prodPerf");
                                }}
                            >
                                View all products
                            </PCButton>
                        </div>
                    </Card>
                </div>
            </Spin>
        </div>
    );
};

export default Home;
