import { useEffect, useState, useRef } from "react";
import { debounce } from "lodash";
import { Sticky } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { getOverviewProduct } from "../../api/prod";
import { List, Card, Button as PCButton, Spin, Input, Descriptions } from "@arco-design/web-react";
// utils
import { pacificTime } from "../../utils/dayjs";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
import { formatMoney } from "../../utils/format";

const ProdPerf = () => {
    const [topProductList, setTopProductList] = useState<PROD.topProducts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchOption, setSearchOption] = useState<PROD.searchOption>({
        reset: true,
        search: "",
        start: "",
        end: "",
    });

    const debouncedSearch = useRef(
        debounce((searchParams: string) => {
            getTopProductList({ ...searchOption, search: searchParams });
        }, 800)
    ).current;

    const getTopProductList = async (searchOption: PROD.searchOption) => {
        const { reset, search } = searchOption;
        setLoading(true);
        await getOverviewProduct(
            pacificTime("2025-06-01").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            pacificTime().endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            10000
        ).then((res) => {
            let new_topProductList = [];
            if (!reset) new_topProductList = [...topProductList, ...res.rankings.topProducts];
            else new_topProductList = [...res.rankings.topProducts];
            if (search) {
                new_topProductList = [...new_topProductList].filter((item) => (item.name || "").includes(search));
            }
            setTopProductList(new_topProductList);
            setLoading(false);
        });
    };

    useEffect(() => {
        getTopProductList(searchOption);
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
                                    debouncedSearch("");
                                }}
                                onChange={(value) => {
                                    setSearchOption({ ...searchOption, search: value });
                                    debouncedSearch(value);
                                }}
                            />
                            <PCButton type="primary">Search</PCButton>
                        </div>
                        <IconFilter style={{ fontSize: 20 }} />
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
