import { NavLink } from "react-router-dom";

export default function Topbar() {
    return (
        <div className="flex items-center space-x-4 min-h-16">
            <h1 className="text-xl font-bold">Inventory Management</h1>
            <nav>
                <NavLink to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                    Dashboard
                </NavLink>
                <NavLink to="/users" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                    Users
                </NavLink>
                <NavLink to="/projects" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                    Products
                </NavLink>
            </nav>
        </div>
    );
}