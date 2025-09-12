import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { List, Card, Button as PCButton, Spin, Tag, Input, Grid } from "@arco-design/web-react";
// api
import { getComposites, waitingDeliveriesOutbounds } from "../../api/inventory";
// constant
import { warehouseOptions, stockStatusOptions, tabsList } from "../../constant/inventory";
const { Row, Col } = Grid;
const Inventory = () => {
    const navigate = useNavigate();
    const [inventoryList, setInventoryList] = useState<Inventory.composite[]>([]);
    const [outboundsList, setOutboundsList] = useState<string[]>([]);
    const [underSafetyStock, setUnderSafetyStock] = useState<number>(0);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<Inventory.searchOption>({
        page: 1,
        pageSize: 10,
        warehouseSearchType: "all",
        reset: true,
        search: "",
        stockStatus: [],
        listType: 1,
    });

    const handleShowChange = () => {
        setShowDropdown(!showDropdown);
    };

    const debouncedSearch = useRef(
        debounce(async (searchParams: string) => {
            if (searchOption.listType == 1) await getInventoryList({ ...searchOption, search: searchParams });
            else await getOutboundsList({ ...searchOption, search: searchParams });
        }, 800)
    ).current;

    const getOutboundsList = async (searchOption: Inventory.searchOption) => {
        setLoading(true);
        const { warehouseSearchType, search } = searchOption;
        let filter = `pagination[page]=${1}&pagination[pageSize]=10000`;
        if (warehouseSearchType != "all") {
            filter += `&warehouse=${warehouseSearchType}`;
        }
        await waitingDeliveriesOutbounds(filter)
            .then((res) => {
                let new_outboundsList = [...res.data];
                if (search) {
                    new_outboundsList = new_outboundsList.filter((item) => {
                        const list = item.split("/");
                        if (list[0].includes[search] || list[1].includes[search] || list[2].includes[search]) return item;
                    });
                }
                setOutboundsList(new_outboundsList);
            })
            .catch(() => {});
        setLoading(false);
    };

    const getInventoryList = async (searchOption: Inventory.searchOption) => {
        const { warehouseSearchType, reset, search, stockStatus } = searchOption;
        setLoading(true);
        let filter = "";
        let andIndex = 0;
        if (warehouseSearchType != "all") filter += `&filters[${warehouseSearchType}][$notNull]=true&filters[${warehouseSearchType}][$gt]=0`;
        if (search) {
            filter += `&filters[$and][${andIndex}][$or][0][sku][$contains]=${search}&filters[$and][${andIndex}][$or][1][compositeProductNameZH][$contains]=${search}&filters[$and][${andIndex}][$or][2][compositeProductName][$contains]=${search}`;
            andIndex++;
        }
        if (stockStatus.length > 0) {
            filter += stockStatus
                .map((item, index) => {
                    return `&filters[$and][${andIndex}][status][$in][${index}]=${item}`;
                })
                .join("");
            andIndex++;
        }
        await getComposites({
            searchParams: filter,
        }).then((res) => {
            if (!reset) setInventoryList([...inventoryList, ...res.data]);
            else setInventoryList(res.data);
            setLoading(false);
        });
    };

    const getLowStockCompositeList = async (params = { selectCategory: "all" }) => {
        const { selectCategory } = params;
        setLoading(true);
        let filter = `filters[showInventory][$eq]=true&filters[productType][$eq]=us&type=inventory&filters[status][$in][0]=lowstock&filters[status][$in][1]=outofstock`;
        if (selectCategory != "all") {
            filter += `&filters[category][$eq]=${selectCategory}`;
        }
        await getComposites({
            searchParams: filter,
        }).then((res) => {
            setUnderSafetyStock(res.meta.pagination?.total || 0);
            setLoading(false);
        });
    };

    useEffect(() => {
        getInventoryList(searchOption);
        getLowStockCompositeList();
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
                        height: 156,
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
                                placeholder="Enter sku/name to search"
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
                                        marginBottom: 8,
                                    }}
                                >
                                    Stock Status
                                </div>
                                <Row gutter={[8, 8]}>
                                    {stockStatusOptions.map((item) => {
                                        return (
                                            <Col key={item.value} span={8}>
                                                <PCButton
                                                    type="secondary"
                                                    style={
                                                        searchOption.stockStatus.includes(item.value)
                                                            ? { width: "100%", marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF" }
                                                            : { width: "100%", marginRight: 8 }
                                                    }
                                                    onClick={async () => {
                                                        if (searchOption.stockStatus.includes(item.value)) {
                                                            setSearchOption({ ...searchOption, stockStatus: searchOption.stockStatus.filter((itemA) => itemA != item.value) });
                                                            await getInventoryList({ ...searchOption, stockStatus: searchOption.stockStatus.filter((itemA) => itemA != item.value) });
                                                        } else {
                                                            const newStockStatus = [...searchOption.stockStatus, item.value];
                                                            setSearchOption({ ...searchOption, stockStatus: newStockStatus });
                                                            await getInventoryList({ ...searchOption, stockStatus: newStockStatus });
                                                        }
                                                    }}
                                                >
                                                    {item.label}
                                                </PCButton>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Card>
                        </Dropdown>
                    </div>
                    <div
                        style={{
                            marginBottom: 12,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {tabsList.map((item) => {
                            return (
                                <div
                                    key={item.value}
                                    style={{
                                        fontSize: 14,
                                        height: 36,
                                        fontWeight: 500,
                                        padding: "7px 0",
                                        color: searchOption.listType == item.value ? "#165DFF" : "#4E5969",
                                        borderBottom: searchOption.listType == item.value ? "2px solid #165DFF" : "none",
                                    }}
                                    onClick={async () => {
                                        setSearchOption({ ...searchOption, listType: item.value as 1 | 2 });
                                        await getOutboundsList({ ...searchOption, listType: item.value as 1 | 2 });
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ overflowX: "auto", width: "100%", display: "flex", justifyContent: "space-between" }}>
                        {warehouseOptions.map((item) => {
                            return (
                                <PCButton
                                    key={item.value}
                                    type="secondary"
                                    style={searchOption.warehouseSearchType == item.value ? { marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF" } : { marginRight: 8 }}
                                    onClick={async () => {
                                        setSearchOption({ ...searchOption, warehouseSearchType: item.value });
                                        if (searchOption.listType == 1) await getInventoryList({ ...searchOption, warehouseSearchType: item.value });
                                        else await getOutboundsList({ ...searchOption, warehouseSearchType: item.value });
                                    }}
                                >
                                    {item.label}
                                </PCButton>
                            );
                        })}
                    </div>
                </div>
            </Sticky>
            {searchOption.listType == 1 && (
                <Card
                    bordered={false}
                    style={{
                        margin: "16px 16px 0px 16px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#FFF3F0",
                            padding: 8,
                        }}
                    >
                        <div
                            style={{
                                color: "#1D2129",
                                fontWeight: 500,
                                marginBottom: 8,
                            }}
                        >
                            SKU Below Safety Stock
                        </div>
                        <div
                            style={{
                                color: "#1D2129",
                                fontWeight: 500,
                                fontSize: 22,
                            }}
                        >
                            {underSafetyStock}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <PCButton
                            size="mini"
                            type="text"
                            style={{
                                padding: 0,
                                fontSize: 14,
                                marginTop: 8,
                                backgroundColor: "transparent",
                            }}
                            onClick={async () => {
                                setSearchOption({ ...searchOption, stockStatus: ["lowstock", "outofstock"] });
                                await getInventoryList({ ...searchOption, stockStatus: ["lowstock", "outofstock"] });
                            }}
                        >
                            View
                        </PCButton>
                    </div>
                </Card>
            )}
            {searchOption.listType == 1 && (
                <Spin loading={loading} style={{ display: "block" }}>
                    <Card style={{ margin: "16px" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
                        <List
                            bordered={false}
                            size={"small"}
                            header={null}
                            dataSource={inventoryList}
                            render={(item, index) => {
                                const tagInfo: {
                                    label: string;
                                    value: string;
                                    tag: string;
                                } = stockStatusOptions.find((itemA) => itemA.value === item.status) || {
                                    label: "Out of Stock",
                                    value: "outofstock",
                                    tag: "red",
                                };
                                return (
                                    <List.Item
                                        onClick={() => {
                                            navigate("/inventory/detail", {
                                                state: {
                                                    inventoryDetail: item,
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
                                                        color: "#1D2129",
                                                    }}
                                                >
                                                    <div>{item.sku}</div>
                                                    <div>{item.us || 0}</div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div style={{ color: "#86909C", whiteSpace: "nowrap" }}>Product Name - US</div>
                                                    <div style={{ color: "#1D2129", width: 150, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{item.compositeProductName}</div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div style={{ color: "#86909C" }}>Product Name</div>
                                                    <div>{item.compositeProductNameZH || 0}</div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div style={{ color: "#86909C" }}>Irvine/尔湾仓</div>
                                                    <div>{item.irvine || 0}</div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div style={{ color: "#86909C" }}>Santa Ana/SA仓</div>
                                                    <div>{item.santaAna || 0}</div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <div style={{ color: "#86909C" }}>Stock Status</div>
                                                    <div className="w-[92px]">
                                                        {tagInfo?.tag && (
                                                            <Tag bordered color={tagInfo.tag}>
                                                                {tagInfo.label}
                                                            </Tag>
                                                        )}
                                                    </div>
                                                </div>
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
            )}
            {searchOption.listType == 2 && (
                <Card style={{ margin: "16px" }} bordered={false}>
                    <List
                        bordered={false}
                        size={"small"}
                        header={null}
                        dataSource={outboundsList}
                        render={(item, index) => {
                            const list = item.split("/");
                            const desc1 = [list[0], list[1], list[2]].join("/");
                            const desc2 = [list[3], list[4], list[5]].join("/");
                            return (
                                <List.Item
                                    key={index}
                                    style={{
                                        padding: "12px 0",
                                    }}
                                >
                                    <div>{desc1}</div>
                                    <div>{desc2}</div>
                                </List.Item>
                            );
                        }}
                    />
                </Card>
            )}
        </div>
    );
};

export default Inventory;
