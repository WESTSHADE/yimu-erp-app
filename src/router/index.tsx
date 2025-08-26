import { useRoutes } from "react-router-dom";

// project import
import MainRoutes from "./MainRouter";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes(MainRoutes);
}
