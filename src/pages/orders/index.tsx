import { useEffect, useState, type ReactNode, useRef } from "react";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import { IconCheckCircle, IconClockCircle, IconFilter, IconCloseCircle, IconInfoCircle, IconLoading, IconStop, IconLeft, IconRight } from "@arco-design/web-react/icon";
import { getOrders } from "../../api/orders";
import { debounce } from "lodash";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { List, Card, Input, Button as PCButton, Spin, Descriptions } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
// constant
import { OrderStatusList } from "../../constant/orders";
// utils
import { formatMoney, formatToLocalTime } from "../../utils/format";
import { pacificTime } from "../../utils/dayjs";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
import SelectCustomize from "../../components/select-customize";
import { filterValueInit } from "../../constant/global";
const StatusMap: Record<ORDERS.OrderStatus, ReactNode> = {
    pending: (
        <span style={{ color: "#FF7D00" }}>
            <IconInfoCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "middle" }} />
            Pending
        </span>
    ),
    processing: (
        <span style={{ color: "#072CA6" }}>
            <IconClockCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "middle" }} />
            Processing
        </span>
    ),
    "partial-shipped": (
        <span style={{ color: "#4080FF" }}>
            <IconLoading style={{ fontSize: 12, marginRight: 6, animation: "none", verticalAlign: "middle" }} />
            Partially Shipped
        </span>
    ),
    shipped: (
        <span style={{ color: "#009A29" }}>
            <IconCheckCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "middle" }} />
            Shipped
        </span>
    ),
    cancelled: (
        <span style={{ color: "#86909C" }}>
            <IconCloseCircle style={{ fontSize: 12, marginRight: 6, verticalAlign: "middle" }} />
            Cancelled
        </span>
    ),
    refunded: (
        <span style={{ color: "#8547DA" }}>
            <IconStop style={{ fontSize: 12, marginRight: 6, verticalAlign: "middle" }} />
            Refunded
        </span>
    ),
};
const Orders = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [ordersList, setOrdersList] = useState<ORDERS.order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<GLOBAL.filterType>(filterValueInit);
    const [searchOption, setSearchOption] = useState<ORDERS.searchOption>({
        page: 1,
        pageSize: 10,
        status: "all",
        reset: true,
        search: "",
    });
    const handleShowChange = () => {
        setShowDropdown(!showDropdown);
    };
    const handleFilter = async (filterValue: GLOBAL.filterType) => {
        setFilterValue(filterValue);
        await getOrdersList(searchOption, filterValue);
    };
    const getOrdersList = async (searchOption: ORDERS.searchOption, filterValue: GLOBAL.filterType) => {
        const { status, reset, search } = searchOption;
        const currentDate = filterValue.startTime
            ? filterValue.endTime
                ? [filterValue.startTime, filterValue.endTime]
                : [filterValue.startTime, filterValue.startTime]
            : [filterValue.singleTime, filterValue.singleTime];
        const startTime = pacificTime(currentDate[0]).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const endDate = pacificTime(currentDate[1]).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        setLoading(true);
        let filter = "&field=date&direction=desc";
        if (status)
            filter +=
                status == "all"
                    ? ""
                    : `&orderStatus=${JSON.stringify({
                          is: status,
                      })}`;
        await getOrders(startTime, endDate, 1, 20, filter).then((res) => {
            let new_ordersList = [];
            if (!reset) new_ordersList = [...ordersList, ...res.dataSummary];
            else new_ordersList = [...res.dataSummary];
            if (search) {
                new_ordersList = [...new_ordersList].filter((item) => String(item.id).includes(search));
            }
            setOrdersList(new_ordersList);
            setLoading(false);
        });
        setShowDropdown(false);
    };

    const debouncedSearch = useRef(
        debounce(async (searchParams: string) => {
            await getOrdersList({ ...searchOption, search: searchParams }, filterValue);
        }, 800)
    ).current;

    useEffect(() => {
        getOrdersList(searchOption, filterValue);
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
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 12,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                            }}
                        >
                            <Input
                                style={{ height: 32 }}
                                placeholder="Enter Order Id to search"
                                allowClear
                                value={searchOption.search}
                                onClear={() => {
                                    setSearchOption({ ...searchOption, search: "" });
                                    debouncedSearch("");
                                }}
                                onChange={(value) => {
                                    setSearchOption({ ...searchOption, search: value });
                                    debouncedSearch(value);
                                }}
                            />
                            <PCButton type="primary">Search</PCButton>
                        </div>
                        <IconFilter
                            style={{ fontSize: 20 }}
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
                            <SelectCustomize filterValue={filterValue} setFilterValue={setFilterValue} handleConfirm={handleFilter} />
                        </Dropdown>
                    </div>
                    <div
                        style={{
                            height: 22,
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
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
                                        getOrdersList(searchOption, { ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
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
                                            getOrdersList(searchOption, { ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div style={{ overflowX: "auto", width: "100%", whiteSpace: "nowrap", display: "flex" }}>
                        {[{ label: "All", value: "all" }, ...OrderStatusList].map((item) => {
                            return (
                                <PCButton
                                    type="secondary"
                                    style={searchOption.status == item.value ? { marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF" } : { marginRight: 8 }}
                                    onClick={async () => {
                                        setSearchOption({ ...searchOption, status: item.value });
                                        await getOrdersList({ ...searchOption, status: item.value }, filterValue);
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
                        render={(item, index) => {
                            const orderData: DataType = [
                                { label: "Payment Date", value: item.paymentTime ? formatToLocalTime(item.paymentTime, "MM-DD-YYYY HH:mm:ss") : "" },
                                { label: "Status", value: StatusMap[item.status as ORDERS.OrderStatus] ? StatusMap[item.status as ORDERS.OrderStatus] : <></> },
                            ];
                            return (
                                <List.Item
                                    onClick={() => {
                                        navigate("/orders/detail", {
                                            state: {
                                                ordersDetail: item,
                                                pageType: "orders",
                                            },
                                        });
                                    }}
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
                </Card>
            </Spin>
        </div>
    );
};

export default Orders;
