import {NavLink} from "react-router-dom";
import '../App.css';
import {useTheme} from '../Contexts/ThemeContext.tsx';

export default function Sidebar() {

    const { darkMode, setDarkMode } = useTheme();

    const NAV = [
        { to: '/',          label: 'Dashboard',  icon: '⬚' },
        { to: '/products',  label: 'Inventory',  icon: '⊟' },
        { to: '/orders',    label: 'Orders',     icon: '📋' },
        { to: '/suppliers', label: 'Suppliers',  icon: '🏭' },
        { to: '/warehouses',label: 'Warehouses', icon: '🏗' },
        { to: '/users',     label: 'Users',      icon: '👤' },
    ]
    return (
        <aside className={`w-[220px] min-h-screen border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-10 ${darkMode ? 'bg-black' : 'bg-white'}`}>
            {/* Logo */}
            <div className="p-5 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">SP</div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm">StockPilot</div>
                        <div className="text-xs text-gray-500">INVENTORY OS</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="px-3 py-2 flex-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-1.5">
                    WORKSPACE
                </div>
                {NAV.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium
                            ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <span className="text-lg">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="border p-1 px-4"
            >
                {darkMode ? "Light" : "Dark"}
            </button>
            {/* User */}
            <div className="px-5 py-3 border-t border-gray-200 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                <div>
                    <div className="text-sm font-medium text-gray-900">Admin</div>
                    <div className="text-xs text-gray-500">Warehouse Admin</div>
                </div>
            </div>
        </aside>
    )
}