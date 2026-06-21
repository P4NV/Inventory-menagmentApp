import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Products from "../pages/Products.tsx";

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
                path: "users",
                element: <Users />,
            },
            {
                path: "projects",
                element: <Products />,
            },
        ],
    },
]);