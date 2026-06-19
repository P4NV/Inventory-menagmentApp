import {NavLink} from "react-router-dom";

export default function Sidebar() {
    return (
        <>
            <aside className="sidebar">
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