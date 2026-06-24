import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './App.css'

export default function App() {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
                <Sidebar />
                <main className="ml-[220px] flex-1 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </ThemeProvider>
    )
}
