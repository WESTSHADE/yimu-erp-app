import { lazy } from "react";

const MainLayout = lazy(() => import("../layout/MainLayout"));
const Login = lazy(() => import("../pages/login"));
const Home = lazy(() => import("../pages/home/index"));
const Orders = lazy(() => import("../pages/orders/index"));
const Inventory = lazy(() => import("../pages/inventory/index"));
const ProdPerf = lazy(() => import("../pages/prodPerf/index"));

const MainRouter = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/",
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    {
                        path: "home",
                        element: <Home />,
                    },
                    {
                        path: "orders",
                        element: <Orders />,
                    },
                    {
                        path: "inventory",
                        element: <Inventory />,
                    },
                    {
                        path: "prodPerf",
                        element: <ProdPerf />,
                    },
                ],
            },
        ],
    },
];

export default MainRouter;
