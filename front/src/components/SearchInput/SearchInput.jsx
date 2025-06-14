import styles from "./SearchInput.module.css"
import buttonStyles from '../../styles/buttons.module.css'

const SearchInput = () => {
    return (
        <div className={styles.inpCont}>
            <input
                id="inp-name"
                placeholder="Buscar"
                required
                className={styles.searchInput}
            />

            <input type="button" className={buttonStyles.searchButton} value={"Buscar"} />
        </div>
    );
}

export default SearchInput;