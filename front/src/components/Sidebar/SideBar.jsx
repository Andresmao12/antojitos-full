import styles from "./SideBar.module.css"
import { NavLink } from "react-router-dom";

import { SHEMA_DB } from "../../utils/constants";

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.titleCont}>
                {/* <img src="../../public/LgAntojitosSF.jpg" alt="" /> */}
                <h2 className={styles.title}>antojitos</h2>
            </div>
            <nav className={styles.nav}>
                <NavLink to={`/dashboard`} className={styles.link}>Dashboard</NavLink>
                {
                    SHEMA_DB.tables.map((element, i) => {

                        if (element.showInSlider) return <NavLink to={`/${element.name?.toLowerCase()}`} key={i} className={styles.link}>{element.name}</NavLink>
                    })
                }
                <NavLink to={`/Plantillas`} className={styles.link}>Plantillas</NavLink>

            </nav>
            <footer className={styles.footer}>
                antojitos ©
            </footer>
        </aside>
    );
}

export default Sidebar;