import { useEffect, useState } from "react";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import { IconFilter, IconLeft, IconRight } from "@arco-design/web-react/icon";
import { getOverviewProduct } from "../../api/prod";
import { List, Card, Button as PCButton, Spin, Input, Descriptions } from "@arco-design/web-react";
// utils
import { pacificTime } from "../../utils/dayjs";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
import { formatMoney } from "../../utils/format";
import SelectCustomize from "../../components/select-customize";
import { filterValueInit } from "../../constant/global";

const ProdPerf = () => {
    const [topProductList, setTopProductList] = useState<PROD.topProducts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<GLOBAL.filterType>(filterValueInit);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<PROD.searchOption>({
        reset: true,
        search: "",
        start: "",
        end: "",
    });
    const handleShowChange = () => {
        setShowDropdown(!showDropdown);
    };

    const handleFilter = async (filterValue: GLOBAL.filterType) => {
        setFilterValue(filterValue);
        await getTopProductList(searchOption, filterValue);
    };

    const getTopProductList = async (searchOption: PROD.searchOption, filterValue: GLOBAL.filterType) => {
        const { reset, search } = searchOption;
        setLoading(true);
        const currentDate = filterValue.startTime
            ? filterValue.endTime
                ? [filterValue.startTime, filterValue.endTime]
                : [filterValue.startTime, filterValue.startTime]
            : [filterValue.singleTime, filterValue.singleTime];
        const startTime = pacificTime(currentDate[0]).startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const endDate = pacificTime(currentDate[1]).endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        await getOverviewProduct(startTime, endDate, 10000).then((res) => {
            let new_topProductList = [];
            if (!reset) new_topProductList = [...topProductList, ...res.rankings.topProducts];
            else new_topProductList = [...res.rankings.topProducts];
            if (search) {
                new_topProductList = [...new_topProductList].filter((item) => (item.name || "").includes(search));
            }
            if (filterValue.sortType) {
                new_topProductList = new_topProductList.sort((a, b) => b[filterValue.sortType as "sold" | "netSales"] - a[filterValue.sortType as "sold" | "netSales"]);
            }
            setTopProductList(new_topProductList);
            setLoading(false);
        });
        setShowDropdown(false);
    };

    useEffect(() => {
        getTopProductList(searchOption, filterValue);
    }, []);

    return (
        <div>
            <Sticky
                style={{
                    width: "100%",
                }}
                topOffset={0}
                getScrollContainer={() => document.getElementById("main-scroll-container") || window}
            >
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
                                placeholder="Enter name to search"
                                allowClear
                                value={searchOption.search}
                                onClear={() => {
                                    setSearchOption({ ...searchOption, search: "" });
                                }}
                                onChange={(value) => {
                                    setSearchOption({ ...searchOption, search: value });
                                }}
                            />
                            <PCButton
                                type="primary"
                                onClick={async () => {
                                    await getTopProductList(searchOption, filterValue);
                                }}
                            >
                                Search
                            </PCButton>
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
                            <SelectCustomize filterValue={filterValue} setFilterValue={setFilterValue} handleConfirm={handleFilter} pageType={"prod"} />
                        </Dropdown>
                    </div>
                    <div
                        style={{
                            height: 22,
                            backgroundColor: "#FFFFFF",
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
                                        getTopProductList(searchOption, { ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
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
                                            getTopProductList(searchOption, { ...filterValue, singleTime: new_singleTime, startTime: filterValue.startTime ? new_singleTime : undefined });
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Sticky>
            <Spin loading={loading} style={{ display: "block" }}>
                <Card style={{ margin: "16px" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
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
                </Card>
            </Spin>
        </div>
    );
};

export default ProdPerf;
