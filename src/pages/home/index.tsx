import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { SearchBar, Button as MobileButton, Sticky } from "@arco-design/mobile-react";
import { Card, Grid, List, Button as PCButton, Table, TableColumnProps } from "@arco-design/web-react";
import { REALTIME_STATISTICS_LIST } from "../../constant/home";
import { IconCheckCircle, IconClockCircle, IconFilter, IconCloseCircle, IconInfoCircle, IconLoading, IconStop, IconPlus } from "@arco-design/web-react/icon";
// utils
import { formatMoney, formatToLocalTime } from "../../utils/format";
// api
import { getOrders } from "../../api/orders";
import { getOverviewMobile } from "../../api/home";
// css
import "../home/index.css";

const { Row, Col } = Grid;
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
    pending: (
        <span style={{ color: "#FF7D00" }}>
            <IconInfoCircle style={{ marginRight: 6 }} />
            Pending
        </span>
    ),
    processing: (
        <span style={{ color: "#072CA6" }}>
            <IconClockCircle style={{ marginRight: 6 }} />
            Processing
        </span>
    ),
    "partial-shipped": (
        <span style={{ color: "#4080FF" }}>
            <IconLoading style={{ marginRight: 6, animation: "none" }} />
            Partially Shipped
        </span>
    ),
    shipped: (
        <span style={{ color: "#009A29" }}>
            <IconCheckCircle style={{ marginRight: 6 }} />
            Shipped
        </span>
    ),
    cancelled: (
        <span style={{ color: "#86909C" }}>
            <IconCloseCircle style={{ marginRight: 6 }} />
            Cancelled
        </span>
    ),
    refunded: (
        <span style={{ color: "#8547DA" }}>
            <IconStop style={{ marginRight: 6 }} />
            Refunded
        </span>
    ),
};
const Home = () => {
    const navigate = useNavigate();
    const [overviewList, setOverviewList] = useState<HOME.overview[]>([]);
    const [realTime, setRealTime] = useState<HOME.realTime>({
        netSales: 50,
        orders: 2,
        averageOrderValue: 20,
        adsSpending: 10,
        adsPercentage: 0.2,
    });

    const [ordersList, setOrdersList] = useState<ORDERS.MostRecentOrders[]>([]);

    const returnTableMap = (record: HOME.overview, key: "netSales" | "orderCount" | "avgOrderValue") => {
        if (["netSales", "orderCount", "avgOrderValue"].includes(key)) {
            return (
                <div>
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
                                color: Number(record[key].vs) > 0 ? "#009A29" : "#CB272D",
                            }}
                        >
                            <IconPlus style={{ color: Number(record[key].vs) > 0 ? "#009A29" : "#CB272D", fontSize: 12 }} />
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
                width: "8px",
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
        await getOrders({
            page: 1,
            pageSize: 8,
            searchParams: "",
        }).then((res) => {
            setOrdersList(res.data);
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
                        height: 32,
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <SearchBar
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
                    />
                    <IconFilter style={{ fontSize: 20, marginLeft: 10 }} />
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
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ color: "#1D2129", fontWeight: 500, fontSize: 22 }}>{item.type == "$" ? formatMoney(realTime[item.key]) : realTime[item.key]}</div>
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
                        render={(item, index) => (
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
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>Payment Date</div>
                                            <div>{item.paymentTime ? formatToLocalTime(item.paymentTime, "MM-DD-YYYY HH:mm:ss") : ""}</div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>Status</div>
                                            <div>{StatusMap[item.status as ORDERS.OrderStatus] ? StatusMap[item.status as ORDERS.OrderStatus] : <></>}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#C9CDD4" }}>
                                        <IconArrowIn />
                                    </div>
                                </div>
                            </List.Item>
                        )}
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
