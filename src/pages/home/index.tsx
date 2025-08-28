import { useEffect, useRef } from "react";
import { SearchBar, Button, Sticky } from "@arco-design/mobile-react";
import { IconFilter } from "@arco-design/web-react/icon";
import { Card, Grid, List } from "@arco-design/web-react";
import { REALTIME_STATISTICS_LIST } from "../../constant/home";
const { Row, Col } = Grid;
const Home = () => {
    const container = useRef<HTMLDivElement | null>(null);
    return (
        <div>
            <div style={{ padding: 16 }}>
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    Overview
                </div>
            </div>
            <Sticky topOffset={0} getScrollContainer={() => document.getElementById("main-scroll-container") || window}>
                <div
                    style={{
                        height: 32,
                        backgroundColor: "#FFFFFF",
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <SearchBar
                        prefix={null}
                        style={{ padding: 0, flex: 1, height: 32 }}
                        actionButton={
                            <Button
                                needActive
                                style={{
                                    width: 77,
                                    height: 32,
                                    fontSize: 14,
                                }}
                            >
                                Search
                            </Button>
                        }
                    />
                    <IconFilter style={{ fontSize: 20, marginLeft: 10 }} />
                </div>
            </Sticky>
            <div
                style={{
                    padding: 16,
                }}
            >
                <Card bordered={false}>
                    <Row gutter={[12, 16]}>
                        {REALTIME_STATISTICS_LIST.map((item) => {
                            return (
                                <Col span={item.span}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            backgroundColor: `${item.color}`,
                                        }}
                                    >
                                        1
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>
            </div>
            <div style={{ padding: "0 16px" }}>
                <div
                    style={{
                        color: "#1D2129",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    Most Recent Orders
                </div>
                <List
                    bordered={false}
                    size={"small"}
                    header="List title"
                    dataSource={[
                        "Beijing Bytedance Technology Co., Ltd.",
                        "Bytedance Technology Co., Ltd.",
                        "Beijing Toutiao Technology Co., Ltd.",
                        "Beijing Volcengine Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                        "China Beijing Bytedance Technology Co., Ltd.",
                    ]}
                    render={(item, index) => (
                        <List.Item key={index}>
                            <div style={{ width: "100%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>WS93682 Sarah Norris</div>
                                    <div>$1,370.00</div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>Payment Date</div>
                                    <div>05-25-2025 12:00:00</div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>Status</div>
                                    <div>Processing</div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default Home;
