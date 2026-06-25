import {NavLink} from "react-router-dom";
import '../App.css';
import {useTheme} from '../contexts/ThemeContext.tsx';

export default function Sidebar() {

    const { darkMode, toggleDarkMode } = useTheme();

    const NAV = [
        { to: '/',          label: 'Dashboard',  icon: '⬚' },
        { to: '/products',  label: 'Inventory',  icon: '⊟' },
        { to: '/orders',    label: 'Orders',     icon: '📋' },
        { to: '/suppliers', label: 'Suppliers',  icon: '🏭' },
        { to: '/warehouses',label: 'Warehouses', icon: '🏗' },
        { to: '/users',     label: 'Users',      icon: '👤' },
    ]
    return (
        <aside className={`w-[220px] min-h-screen border-r border-gray-200 dark:border-slate-700 flex flex-col fixed top-0 left-0 bottom-0 z-10 bg-white dark:bg-slate-800 transition-colors duration-300`}>
            {/* Logo */}
            <div className="p-5 pb-2 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">SP</div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-slate-100 text-sm transition-colors duration-300">StockPilot</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-300">INVENTORY OS</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="px-3 py-2 flex-1">
                <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider px-3 py-1.5 transition-colors duration-300">
                    WORKSPACE
                </div>
                {NAV.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2 rounded-md text-lg font-medium transition-all duration-200
                            ${isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'}
                        `}
                    >
                        <span className="text-lg">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>
            <button
                onClick={toggleDarkMode}
                className="border border-gray-200 dark:border-slate-600 p-1 px-4 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            {/* User */}
            <div className="px-5 py-3 border-t border-gray-200 dark:border-slate-700 flex items-center gap-2.5 transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors duration-300">Admin</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-300">Warehouse Admin</div>
                </div>
            </div>
        </aside>
    )
}

// add some info of the stock but simple and minimal the most important bit
//make the user section functional for login logging out and etc