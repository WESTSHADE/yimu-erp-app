import { useEffect, useState } from "react";
import { Sticky } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { getComposites } from "../../api/inventory";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { List, Card, Button as PCButton, Spin, Tag, Input, Tabs } from "@arco-design/web-react";
// constant
import { warehouseOptions, stockStatusOptions } from "../../constant/inventory";
const Inventory = () => {
    const [inventoryList, setInventoryList] = useState<Inventory.composite[]>([]);
    const [underSafetyStock, setUnderSafetyStock] = useState<number>(0);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<Inventory.searchOption>({
        page: 1,
        pageSize: 10,
        warehouseSearchType: "all",
        reset: true,
    });

    const getInventoryList = async (searchOption: Inventory.searchOption) => {
        const { warehouseSearchType, reset } = searchOption;
        setScrollLoading(true);
        setLoading(true);
        let filter = `pagination[page]=${1}&pagination[pageSize]=${20}`;
        if (warehouseSearchType != "all") filter += `&filters[${warehouseSearchType}][$notNull]=true&filters[${warehouseSearchType}][$gt]=0`;
        await getComposites({
            searchParams: filter,
        }).then((res) => {
            if (!reset) setInventoryList([...inventoryList, ...res.data]);
            else setInventoryList(res.data);
            setScrollLoading(false);
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
                        }}
                    >
                        <Input placeholder="Enter sku/name to search" allowClear />
                        <PCButton
                            type="primary"
                            style={{
                                marginRight: 10,
                            }}
                        >
                            Search
                        </PCButton>
                        <IconFilter style={{ fontSize: 20 }} />
                    </div>
                    <div style={{ overflowX: "auto", width: "max-content" }}>
                        {warehouseOptions.map((item) => {
                            return (
                                <PCButton
                                    type="secondary"
                                    style={searchOption.warehouseSearchType == item.value ? { marginRight: 8, backgroundColor: "#E8F3FF", color: "#165DFF" } : { marginRight: 8 }}
                                    onClick={async () => {
                                        setSearchOption({ ...searchOption, warehouseSearchType: item.value });
                                        await getInventoryList({ ...searchOption, warehouseSearchType: item.value });
                                    }}
                                >
                                    {item.label}
                                </PCButton>
                            );
                        })}
                    </div>
                </div>
            </Sticky>
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
            </Card>
            <Spin loading={loading} style={{ display: "block" }}>
                <Card style={{ margin: "16px" }} bordered={false} bodyStyle={{ padding: "0px 14px" }}>
                    <List
                        bordered={false}
                        size={"small"}
                        header={null}
                        dataSource={inventoryList}
                        scrollLoading={scrollLoading}
                        onReachBottom={async () => {
                            await getInventoryList({ ...searchOption, page: searchOption.page + 1 });
                            setSearchOption({ ...searchOption, page: searchOption.page + 1, reset: false });
                        }}
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
        </div>
    );
};

export default Inventory;
