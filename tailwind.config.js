module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    theme: {
        extend: {
            spacing: Object.fromEntries(
                // 生成 0-200px 的间距配置（步长 20px）
                Array.from({ length: 11 }, (_, i) => i * 20).map((val) => [val.toString(), `${val}px`])
            ),
        },
    },
    plugins: [],
};
