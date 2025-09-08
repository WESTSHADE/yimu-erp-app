import { useEffect, useState } from "react";
import { SearchBar, Button as MobileButton, Sticky } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { getComposites } from "../../api/inventory";
import { IconArrowIn } from "@arco-design/mobile-react/esm/icon";
import { List, Card, Button as PCButton, Spin, Tag } from "@arco-design/web-react";
// constant
import { warehouseOptions, stockStatusOptions } from "../../constant/inventory";
const Inventory = () => {
    const [inventoryList, setInventoryList] = useState<Inventory.composite[]>([]);
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
        let filter = "";
        if (warehouseSearchType != "all") filter += `&filters[${warehouseSearchType}][$notNull]=true&filters[${warehouseSearchType}][$gt]=0`;
        await getComposites({
            page: 1,
            pageSize: 20,
            searchParams: filter,
        }).then((res) => {
            if (!reset) setInventoryList([...inventoryList, ...res.data]);
            else setInventoryList(res.data);
            setScrollLoading(false);
            setLoading(false);
        });
    };

    useEffect(() => {
        getInventoryList(searchOption);
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
                                tag: "",
                                label: "",
                                value: "",
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
