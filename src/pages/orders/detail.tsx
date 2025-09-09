import { ReactNode, useEffect, useRef } from "react";
import { Sticky, NavBar } from "@arco-design/mobile-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Tag, Descriptions } from "@arco-design/web-react";
// constant
import { stockStatusOptions } from "../../constant/inventory";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
// utils
import { formatToLocalTime } from "../../utils/format";
import { IconCheckCircle, IconClockCircle, IconCloseCircle, IconInfoCircle, IconLoading, IconStop } from "@arco-design/web-react/icon";
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
    pending: (
        <span style={{ color: "#FF7D00" }}>
            <IconInfoCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Pending
        </span>
    ),
    processing: (
        <span style={{ color: "#072CA6" }}>
            <IconClockCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Processing
        </span>
    ),
    "partial-shipped": (
        <span style={{ color: "#4080FF" }}>
            <IconLoading style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Partially Shipped
        </span>
    ),
    shipped: (
        <span style={{ color: "#009A29" }}>
            <IconCheckCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Shipped
        </span>
    ),
    cancelled: (
        <span style={{ color: "#86909C" }}>
            <IconCloseCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Cancelled
        </span>
    ),
    refunded: (
        <span style={{ color: "#8547DA" }}>
            <IconStop style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }} />
            Refunded
        </span>
    ),
};
const OrdersDetail = () => {
    const navBarRef = useRef(null);
    const location: {
        state: {
            ordersDetail: ORDERS.order;
        };
    } = useLocation();
    const navigator = useNavigate();
    const { ordersDetail } = location.state;

    useEffect(() => {}, []);

    const ordersData: DataType = [
        {
            label: "Payment Date",
            value: ordersDetail.paymentTime ? formatToLocalTime(ordersDetail.paymentTime, "MM-DD-YYYY HH:mm:ss") : "",
        },
        {
            label: "Status",
            value: <div>{StatusMap[ordersDetail.status as ORDERS.OrderStatus] ? StatusMap[ordersDetail.status as ORDERS.OrderStatus] : <></>}</div>,
        },
        {
            label: "Customer",
            value: `${ordersDetail?.shipping?.firstName || ""} ${ordersDetail?.shipping?.lastName || ""}`,
        },
        {
            label: "Customer Type",
            value: ordersDetail.customerType,
        },
        {
            label: "Product Name*Items sold",
            value:
                ordersDetail.items.map((item) => {
                    return <div>{item.product ? item.product.name : `(${item?.variation?.sku})${item?.variation?.product?.name}`}</div>;
                }) || 0,
        },
        {
            label: "Coupon Code",
            value: ordersDetail.coupons.map((item) => item.code).join("、") || 0,
        },
        {
            label: "Net Sales",
            // netSales = subtotal - discount
            value: ordersDetail.subtotal - ordersDetail.discount || 0,
        },
    ];

    return (
        <div>
            <Sticky
                style={{
                    width: "100%",
                }}
                topOffset={0}
                getScrollContainer={() => document.getElementById("main-scroll-container") || window}
            >
                <NavBar
                    ref={navBarRef}
                    onClickLeft={() => {
                        navigator("/orders");
                    }}
                    fixed={false}
                    hasBottomLine={false}
                    style={{ height: "44px" }}
                >
                    <div style={{ fontSize: 18, textAlign: "center", width: "100%", lineHeight: "44px", fontWeight: 500 }}>Order Details</div>
                </NavBar>
            </Sticky>
            <Card
                bordered={false}
                style={{
                    margin: 16,
                }}
            >
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 8,
                    }}
                >
                    {`WS${ordersDetail.id}`}
                </div>
                <Descriptions
                    data={ordersData}
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
            </Card>
        </div>
    );
};

export default OrdersDetail;
