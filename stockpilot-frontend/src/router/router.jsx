import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Projects from "../pages/Projects";

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
                element: <Projects />,
            },
        ],
    },
]);