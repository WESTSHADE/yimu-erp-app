import { ReactNode, useEffect, useRef, useState } from "react";
import { Sticky, NavBar } from "@arco-design/mobile-react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { Card, Descriptions, Grid } from "@arco-design/web-react";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
// api
import { getCustomerType } from "../../api/orders";
// utils
import { formatMoney, formatToLocalTime } from "../../utils/format";
import {
  IconCheckCircle,
  IconClockCircle,
  IconCloseCircle,
  IconInfoCircle,
  IconLoading,
  IconLeft,
  IconStop,
} from "@arco-design/web-react/icon";
const { Row, Col } = Grid;
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
  pending: (
    <span style={{ color: "#FF7D00" }}>
      <IconInfoCircle
        style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }}
      />
      Pending
    </span>
  ),
  processing: (
    <span style={{ color: "#072CA6" }}>
      <IconClockCircle
        style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }}
      />
      Processing
    </span>
  ),
  "partial-shipped": (
    <span style={{ color: "#4080FF" }}>
      <IconLoading
        style={{
          fontSize: 12,
          marginRight: 6,
          verticalAlign: "baseline",
          animation: "none",
        }}
      />
      Partially Shipped
    </span>
  ),
  shipped: (
    <span style={{ color: "#009A29" }}>
      <IconCheckCircle
        style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }}
      />
      Shipped
    </span>
  ),
  cancelled: (
    <span style={{ color: "#86909C" }}>
      <IconCloseCircle
        style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }}
      />
      Cancelled
    </span>
  ),
  refunded: (
    <span style={{ color: "#8547DA" }}>
      <IconStop
        style={{ fontSize: 12, marginRight: 6, verticalAlign: "baseline" }}
      />
      Refunded
    </span>
  ),
};
const OrdersDetail = () => {
  const navBarRef = useRef(null);
  const location: {
    state: {
      ordersDetail: ORDERS.order;
      pageType: "home" | "orders";
    };
  } = useLocation();
  const navigator = useNavigate();
  const { ordersDetail, pageType } = location.state;
  const [customerType, setCustomerType] = useState("New");
  const ordersData: DataType = [
    {
      label: "Payment Date",
      value: ordersDetail.paymentTime
        ? formatToLocalTime(ordersDetail.paymentTime, "MM-DD-YYYY HH:mm:ss")
        : "",
    },
    {
      label: "Status",
      value: (
        <div>
          {StatusMap[ordersDetail.status as ORDERS.OrderStatus] ? (
            StatusMap[ordersDetail.status as ORDERS.OrderStatus]
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      label: "Customer",
      value: `${ordersDetail?.billing?.firstName || ""} ${
        ordersDetail?.billing?.lastName || ""
      }`,
    },
    {
      label: "Customer Type",
      value: customerType,
    },
    {
      label: (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: "1.4",
          }}
        >
          Product Name * Items sold
        </div>
      ),
      value:
        ordersDetail.items.map((item) => {
          return (
            <div>
              {item.product
                ? item.product.name
                : `(${item?.variation?.sku})${item?.variation?.product?.name}`}{" "}
              * {item.quantity}
            </div>
          );
        }) || 0,
    },
    {
      label: "Coupon Code",
      value: ordersDetail.coupons.map((item) => item.code).join("、") || 0,
    },
    {
      label: "Net Sales",
      // netSales = subtotal - discount
      value: formatMoney(ordersDetail.subtotal - ordersDetail.discount || 0, 2),
    },
  ];

  useEffect(() => {
    if (
      ordersDetail.billing.email &&
      (ordersDetail.billing?.firstName || ordersDetail.billing?.lastName)
    )
      getCustomerType(
        ordersDetail.billing.email,
        ordersDetail.billing.firstName && ordersDetail.billing.lastName
          ? ordersDetail.billing.firstName + " " + ordersDetail.billing.lastName
          : ordersDetail.billing.firstName
          ? ordersDetail.billing.firstName
          : ordersDetail.billing.lastName
      ).then((res) => {
        if (res.data?.[0]?.orderCount > 1) setCustomerType("Returning");
      });
  }, [ordersDetail]);

  return (
    <div>
      <Sticky
        style={{
          width: "100%",
        }}
        topOffset={0}
        getScrollContainer={() =>
          document.getElementById("main-scroll-container") || window
        }
      >
        <NavBar
          ref={navBarRef}
          leftContent={false}
          fixed={false}
          hasBottomLine={false}
          style={{ height: "44px" }}
        >
          <Row style={{ height: "44px" }} align="center">
            <Col
              span={6}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconLeft
                style={{
                  fontSize: "20px",
                  marginLeft: "16px",
                  color: "#1D2129",
                }}
                onClick={() => {
                  if (pageType == "orders") navigator("/orders");
                  else navigator("/home");
                }}
              />
            </Col>
            <Col span={12}>
              <div
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  width: "100%",
                  lineHeight: "44px",
                  fontWeight: 500,
                }}
              >
                Order Details
              </div>
            </Col>
          </Row>
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
