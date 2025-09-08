import { useEffect, useState, type ReactNode } from "react";
import { SearchBar, Button as MobileButton, Sticky } from "@arco-design/mobile-react";
import { IconCheckCircle, IconClockCircle, IconFilter, IconCloseCircle, IconInfoCircle, IconLoading, IconStop } from "@arco-design/web-react/icon";
import { getOrders } from "../../api/orders";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { List, Card, Button as PCButton, Spin } from "@arco-design/web-react";
// constant
import { OrderStatusList } from "../../constant/orders";
// utils
import { formatMoney, formatToLocalTime } from "../../utils/format";
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
const Orders = () => {
    const [ordersList, setOrdersList] = useState<ORDERS.MostRecentOrders[]>([]);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<ORDERS.searchOption>({
        page: 1,
        pageSize: 10,
        status: "all",
        reset: true,
    });
    const getOrdersList = async (searchOption: ORDERS.searchOption) => {
        const { status, reset } = searchOption;
        setScrollLoading(true);
        setLoading(true);
        let filter = "";
        if (status) filter += status == "all" ? "" : `&filters[status][$eq]=${status}`;
        await getOrders({
            page: 1,
            pageSize: 20,
            searchParams: filter,
        }).then((res) => {
            if (!reset) setOrdersList([...ordersList, ...res.data]);
            else setOrdersList(res.data);
            setScrollLoading(false);
            setLoading(false);
        });
    };

    useEffect(() => {
        getOrdersList(searchOption);
    }, []);

    return (
        <div>
            <Sticky topOffset={0} getScrollContainer={() => document.getElementById("main-scroll-container") || window}>
                <div
                    style={{
                        height: "max-content",
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                    }}
                >
                    <div
                        style={{
                            height: 32,
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
                    <div style={{ overflowX: "auto", width: "max-content" }}>
                        {[{ label: "All", value: "all" }, ...OrderStatusList].map((item) => {
                            return (
                                <PCButton
                                    type="secondary"
                                    style={searchOption.status == item.value ? { marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF" } : { marginRight: 8 }}
                                    onClick={async () => {
                                        setSearchOption({ ...searchOption, status: item.value });
                                        await getOrdersList({ ...searchOption, status: item.value });
                                    }}
                                >
                                    {item.label}
                                </PCButton>
                            );
                        })}
                    </div>
                </div>
            </Sticky>
            <Spin loading={loading} style={{ display: "block" }}>
                <Card style={{ margin: "16px" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
                    <List
                        bordered={false}
                        size={"small"}
                        header={null}
                        dataSource={ordersList}
                        scrollLoading={scrollLoading}
                        onReachBottom={async () => {
                            await getOrdersList({ ...searchOption, page: searchOption.page + 1 });
                            setSearchOption({ ...searchOption, page: searchOption.page + 1, reset: false });
                        }}
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
                </Card>
            </Spin>
        </div>
    );
};

export default Orders;
