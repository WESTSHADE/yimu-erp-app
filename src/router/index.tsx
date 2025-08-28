import { useRoutes } from "react-router-dom";
import MainRoutes from "./MainRouter";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes(MainRoutes);
}
