import { ContextProvider } from "@arco-design/mobile-react";
import { enableFlexible } from "../utils/flexible";
import { useEffect } from "react";
import { Layout } from "@arco-design/web-react";
import Sider from "./Sider";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Footer = Layout.Footer;
const Content = Layout.Content;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // 在主布局中启用响应式适配
    useEffect(() => {
        enableFlexible();
    }, []);

    const validateExp = () => {
        const exp = localStorage.getItem("exp");
        const date = new Date().getTime();
        if (!exp || date > Number(exp) * 1000) {
            // 清除过期的 token
            localStorage.removeItem("access_token");
            localStorage.removeItem("exp");
            navigate("/login");
            return false;
        }
        return true;
    };

    // 监听路由变化，实时验证 exp
    useEffect(() => {
        // 每次路由变化时验证 exp
        validateExp();
    }, [location.pathname]);

    return (
        <ContextProvider>
            <Layout style={{ height: "100vh", position: "relative", display: "flex", flexDirection: "column", backgroundColor: "#F7F8FA" }}>
                <Content
                    id="main-scroll-container"
                    style={{
                        overflow: "auto",
                        flex: 1,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        zIndex: 1000,
                    }}
                >
                    <Sider />
                </Footer>
            </Layout>
        </ContextProvider>
    );
};

export default MainLayout;
