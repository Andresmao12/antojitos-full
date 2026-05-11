import styles from "./SideBar.module.css"
import { NavLink } from "react-router-dom";
import { SHEMA_DB } from "../../utils/constants";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button className={styles.btnToggleTheme} onClick={toggleTheme}>
            {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
    );
}

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.titleCont}>
                <h1 className={styles.title}>antojitos</h1>
            </div>
            <nav className={styles.nav}>
                <NavLink to={`/dashboard`} className={styles.link}>Inicio</NavLink>
                {
                    SHEMA_DB.tables.map((element, i) => {
                        if (element.showInSlider) return (
                            <NavLink to={`/${element.name?.toLowerCase()}`} key={i} className={styles.link}>
                                {element.name}
                            </NavLink>
                        )
                    })
                }
                <NavLink to={`/Plantillas`} className={styles.link}>Plantillas</NavLink>
                <ThemeToggle />
            </nav>
            <footer className={styles.footer}>
                antojitos ©
            </footer>
        </aside>
    );
}

export default Sidebar;