import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Suppliers from "../pages/Suppliers";
import Warehouses from "../pages/Warehouses";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "suppliers",
                element: <Suppliers />,
            },
            {
                path: "warehouses",
                element: <Warehouses />,
            },
            {
                path: "users",
                element: <Users />,
            },
        ],
    },
]);