import {NavLink} from "react-router-dom";
import '../App.css';

export default function Sidebar() {
    return (
        <>
            <aside className="w-72 border-r-2 border-white p-4">
                <div className="">
                    <h1>
                        Inventory management
                    </h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/">Dashboard</NavLink>
                        </li>

                        <li>
                            <NavLink to="/users">Users</NavLink>
                        </li>

                        <li>
                            <NavLink to="/projects">Projects</NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}