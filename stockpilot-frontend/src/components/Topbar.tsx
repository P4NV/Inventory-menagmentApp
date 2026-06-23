import { NavLink } from "react-router-dom";

export default function Topbar() {
    return (
        <div className="flex items-center space-x-4 min-h-16">
            <h1 className="text-xl font-bold">Inventory Management</h1>
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                            isActive ? 'bg-primary-200 text-primary-800' : 'text-gray-600'
                        }`}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                            isActive ? 'bg-primary-200 text-primary-800' : 'text-gray-600'
                        }`}
                >
                    Users
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                            isActive ? 'bg-primary-200 text-primary-800' : 'text-gray-600'
                        }`}
                >
                    Products
                </NavLink>
            </nav>
        </div>
    );
}