import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import "./App.css";

function App() {
    return (
        <div className="app-shell">
            <Sidebar/>
            <div className="main-layout">
                <header className="topbar">
                    Topbar
                </header>

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default App;