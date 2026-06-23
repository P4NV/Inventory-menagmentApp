import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.tsx'
import './App.css'

export default function App() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-[220px] flex-1 min-h-screen">
                <Outlet />
            </main>
        </div>
    )
}