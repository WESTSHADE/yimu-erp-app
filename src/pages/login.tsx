import IconArrowIn from "@arco-design/mobile-react/esm/icon/IconArrowIn";
import "./login.css";

const Login = () => {
    const wskj_appId = "cli_a7cfd8a1903bd00c";
    const yimu_appId = "cli_a7cd15ffa9fad013";
    const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
    const redirect_uri = baseUrl + "/login";
    const wskj_feishu_login = `https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=${wskj_appId}&redirect_uri=${redirect_uri}&state=wskj${
        process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" ? "" : "_dev"
    }`;
    const yimu_feishu_login = `https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=${yimu_appId}&redirect_uri=${redirect_uri}&state=yimu${
        process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" ? "" : "_dev"
    }`;

    return (
        <main className="comparison">
            <div className="card">
                <div className="card-header">
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "2rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "rgb(255 255 255 / 0.2)",
                                    padding: "0.75rem",
                                    borderRadius: "9999px",
                                }}
                            ></div>
                        </div>
                        <h1
                            style={{
                                fontSize: "1.875rem",
                                lineHeight: "2.25rem",
                                fontWeight: 700,
                                color: "white",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p
                            style={{
                                color: "rgb(255 255 255 / 0.8)",
                            }}
                        >
                            Choose your origination
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        <a
                            href={wskj_feishu_login}
                            rel="noopener nofollow"
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <button className="select-style">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        杭州炜石信息技术有限公司
                                    </span>
                                </div>
                                <IconArrowIn className="icon-style" />
                            </button>
                        </a>
                        <a
                            href={yimu_feishu_login}
                            rel="noopener nofollow"
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <button className="select-style">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        YIMU INTERNATIONAL INC
                                    </span>
                                </div>
                                <IconArrowIn className="icon-style" />
                            </button>
                        </a>
                    </div>

                    <div
                        style={{
                            marginTop: "2rem",
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                color: "rgb(255 255 255 / 0.6)",
                                fontSize: "0.875rem",
                                lineHeight: "1.25rem",
                            }}
                            className="text-white/60 text-sm"
                        >
                            © westshade · yimu
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
