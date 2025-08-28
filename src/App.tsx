import Router from "./router";
import setRootPixel from "@arco-design/mobile-react/tools/flexible";
import "@arco-design/web-react/dist/css/arco.css?raw";

setRootPixel(37.5);
function App() {
    return (
        <div style={{ height: "auto", width: "100%" }}>
            <Router />
        </div>
    );
}

export default App;
