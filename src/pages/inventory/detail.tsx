import { useEffect, useRef } from "react";
import { Sticky, NavBar } from "@arco-design/mobile-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Tag, Descriptions } from "@arco-design/web-react";
// constant
import { stockStatusOptions } from "../../constant/inventory";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
const InventoryDetail = () => {
    const navBarRef = useRef(null);
    const location: {
        state: {
            inventoryDetail: Inventory.composite;
        };
    } = useLocation();
    const navigator = useNavigate();
    const { inventoryDetail } = location.state;

    useEffect(() => {}, []);

    const inventoryData: DataType = [
        {
            label: "Irvine/尔湾仓",
            value: inventoryDetail.irvine || 0,
        },
        {
            label: "Santa Ana/SA仓",
            value: inventoryDetail.santaAna || 0,
        },
        {
            label: "Total US Inventory / 美国现有库存",
            value: inventoryDetail.us || 0,
        },
        {
            label: "Stock Status",
            value: (() => {
                const tagInfo: {
                    label: string;
                    value: string;
                    tag: string;
                } = stockStatusOptions.find((itemA) => itemA.value === inventoryDetail.status) || {
                    label: "Out of Stock",
                    value: "outofstock",
                    tag: "red",
                };
                return (
                    <div>
                        {tagInfo?.tag && (
                            <Tag bordered color={tagInfo.tag}>
                                {tagInfo.label}
                            </Tag>
                        )}
                    </div>
                );
            })(),
        },
        {
            label: "Factory Warehouse / 工厂仓",
            value: inventoryDetail.factory || 0,
        },
        {
            label: "Factory Warehouse / 工厂仓",
            value: inventoryDetail.factory || 0,
        },
        {
            label: "Total Inventory / 全部现有库存",
            value: inventoryDetail.inventory || 0,
        },
        {
            label: "In Transit / 在途",
            value: inventoryDetail.transit || 0,
        },
    ];

    const ProductData: DataType = [
        {
            label: "Composite SKU",
            value: inventoryDetail?.sku || "",
        },
        {
            label: "Product Name - US",
            value: inventoryDetail?.compositeProductName || "0",
        },
        {
            label: "Product Name",
            value: inventoryDetail?.compositeProductNameZH || "",
        },
        {
            label: "Description",
            value: inventoryDetail?.description || "",
        },
        {
            label: "LengthZH*WidthZH*HeightZH(cm)",
            value: `${inventoryDetail.lengthZH || "0"}*${inventoryDetail.widthZH || "0"}*${inventoryDetail.heightZH || "0"}`,
        },
        {
            label: "Length*Width*Height (inch)",
            value: `${inventoryDetail.length || "0"}*${inventoryDetail.width || "0"}*${inventoryDetail.height || "0"}`,
        },
        {
            label: "WeightZH(kg)",
            value: inventoryDetail.weightZH || "",
        },
        {
            label: "WeightZH(lb)",
            value: inventoryDetail.weight || "",
        },
        {
            label: "Per Pallet",
            value: inventoryDetail.perPallet || 0,
        },
        {
            label: "Pallet Status",
            value: inventoryDetail.palletStatus || "",
        },
        {
            label: "Category",
            value: inventoryDetail.categoryZH || "",
        },
        {
            label: "Note",
            value: inventoryDetail.inventoryNote || "",
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
                        navigator("/inventory");
                    }}
                    fixed={false}
                    hasBottomLine={false}
                    style={{ height: "44px" }}
                >
                    <div style={{ fontSize: 18, textAlign: "center", width: "100%", lineHeight: "44px", fontWeight: 500 }}>{inventoryDetail.sku}</div>
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
                    Inventory Information
                </div>
                <Descriptions
                    data={inventoryData}
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
                    Product Information
                </div>
                <Descriptions
                    data={ProductData}
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

export default InventoryDetail;
