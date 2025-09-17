import { TabBar, Sticky } from "@arco-design/mobile-react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconFile, IconHome } from "@arco-design/mobile-react/esm/icon";
import { IconArchive, IconTag } from "@arco-design/web-react/icon";

const SiderContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 根据当前路径确定激活的标签索引
    const getActiveIndex = () => {
        const pathname = location.pathname;
        if (pathname.includes("/home") || pathname === "/") return 0;
        if (pathname.includes("/orders")) return 1;
        if (pathname.includes("/inventory")) return 2;
        if (pathname.includes("/prodPerf")) return 3;
        return 0; // 默认返回首页
    };

    const tabs = [
        {
            title: <span style={{ fontSize: 10 }}>Home</span>,
            icon: (
                <IconHome
                    style={{
                        fontSize: 16,
                    }}
                />
            ),
        },
        {
            title: <span style={{ fontSize: 10 }}>Orders</span>,
            icon: (
                <IconFile
                    style={{
                        fontSize: 16,
                    }}
                />
            ),
        },
        {
            title: <span style={{ fontSize: 10 }}>Inventory</span>,
            icon: (
                <IconArchive
                    style={{
                        fontSize: 16,
                    }}
                />
            ),
        },
        {
            title: <span style={{ fontSize: 10 }}>Prod. Perf.</span>,
            icon: (
                <IconTag
                    style={{
                        fontSize: 16,
                    }}
                />
            ),
        },
    ];

    return (
        <Sticky position="bottom" style={{ height: 65 }}>
            <TabBar
                fixed={false}
                style={{ height: "100%", backgroundColor: "#fff" }}
                activeIndex={getActiveIndex()}
                onChange={(value) => {
                    if (value == 0) navigate("/home");
                    else if (value == 1) navigate("/orders");
                    else if (value == 2) navigate("/inventory");
                    else if (value == 3) navigate("/prodPerf");
                }}
            >
                {tabs.map((tab, index) => (
                    <TabBar.Item title={tab.title} icon={tab.icon} key={index} />
                ))}
            </TabBar>
        </Sticky>
    );
};
export default SiderContent;
