import { useEffect, useState, type ReactNode } from "react";
import { getOrders } from "../../api/orders";
import { SearchBar, Button, Sticky } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { Card, Grid, List } from "@arco-design/web-react";
import { REALTIME_STATISTICS_LIST } from "../../constant/home";
import { IconCheckCircle, IconClockCircle, IconCloseCircle, IconInfoCircle, IconLoading, IconStop } from "@arco-design/web-react/icon";
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
            Shipped{" "}
        </span>
    ),
    cancelled: (
        <span style={{ color: "#86909C" }}>
            <IconCloseCircle style={{ marginRight: 6 }} />
            Cancelled{" "}
        </span>
    ),
    refunded: (
        <span style={{ color: "#8547DA" }}>
            <IconStop style={{ marginRight: 6 }} />
            Refunded{" "}
        </span>
    ),
};
const Home = () => {
    const [ordersList, setOrdersList] = useState<ORDERS.MostRecentOrders[]>([]);
    const getOrdersList = async () => {
        await getOrders({
            page: 1,
            pageSize: 8,
            searchParams: "",
        }).then((res) => {
            setOrdersList(res.data);
        });
    };

    useEffect(() => {
        getOrdersList();
    }, []);

    return (
        <div>
            <div style={{ padding: 16 }}>
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    Overview
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
                            <Button
                                needActive
                                style={{
                                    width: 77,
                                    height: 32,
                                    fontSize: 14,
                                }}
                            >
                                Search
                            </Button>
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
                    <Row gutter={[12, 16]}>
                        {REALTIME_STATISTICS_LIST.map((item) => {
                            return (
                                <Col span={item.span}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            backgroundColor: `${item.color}`,
                                        }}
                                    >
                                        1
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
                <Card bordered={false} bodyStyle={{ padding: "0px 14px" }}>
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
                                <div style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>{`WS${item.id} ${item?.shipping?.firstName || ""} ${item?.shipping?.lastName || ""}`}</div>
                                        <div>{item.total}</div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>Payment Date</div>
                                        <div>05-25-2025 12:00:00</div>
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
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Home;
