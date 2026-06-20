import { Outlet } from "react-router-dom";
import Sidebar from './components/Sidebar.tsx'
import Topbar from './components/Topbar';
import "./App.css";

function App() {
    return (
        <div className="flex h-screen bg-gray-500">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-gray-200 flex items-center px-4">
                    <Topbar />
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default App;