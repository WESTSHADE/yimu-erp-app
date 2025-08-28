import { Container, createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { BrowserRouter } from "react-router-dom";
const root = createRoot(document.getElementById("root") as Container);

root.render(
    <BrowserRouter basename="/">
        <App />
    </BrowserRouter>
);
