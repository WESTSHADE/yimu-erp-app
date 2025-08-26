import React from "react";
import { Container, createRoot } from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root") as Container);

root.render(
    <HashRouter basename="/">
        <App />
    </HashRouter>
);
