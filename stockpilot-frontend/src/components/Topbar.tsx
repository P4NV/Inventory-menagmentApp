import { NavLink } from "react-router-dom";

export default function Topbar() {
    return (
        <div className="flex items-center space-x-4 min-h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 transition-colors duration-300">
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-300">Inventory Management</h1>
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-slate-300'
                        }`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-slate-300'
                        }`
                    }
                >
                    Users
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-slate-300'
                        }`
                    }
                >
                    Products
                </NavLink>
            </nav>
        </div>
    );
}
