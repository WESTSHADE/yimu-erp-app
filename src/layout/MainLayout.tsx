import { ContextProvider } from "@arco-design/mobile-react";
import enUS from "@arco-design/mobile-utils/esm/locale/en-US";
import Sider from "./Sider";
import { Outlet } from "react-router-dom";

import { Layout } from "@arco-design/web-react";
const Footer = Layout.Footer;
const Content = Layout.Content;
const MainLayout = () => {
    return (
        <ContextProvider locale={enUS}>
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
                        background: "#fff",
                        height: 52,
                    }}
                >
                    <Sider />
                </Footer>
            </Layout>
        </ContextProvider>
    );
};

export default MainLayout;
