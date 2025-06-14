import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/SideBar";
import styles from "./IndexLayout.module.css";

export default function Layout() {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}