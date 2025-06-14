import { useState, useEffect } from "react"

import styles from "./Insumos.module.css"
import buttonStyles from "../../styles/buttons.module.css"

import DataTable from '../../components/DataTable/DataTable'
import SearchInput from '../../components/SearchInput/SearchInput'
import DynamicForm from "../../components/DynamicForm/DynamicForm"


import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'


const Insumos = () => {
    console.log('SHEMA_DB', SHEMA_DB)

    const tableShema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'insumo')
    console.log("TABLESHEMA A PASAR DESDE INSUMOS: ----> ", tableShema)
    const { data, fetchAll, fetchById, createItem, updateItem, deleteItem, loading, error, item } = useApi(tableShema)
    const [formData, setFormData] = useState({})
    const [showCreate, setShowCreate] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => { fetchAll() }, []);

    const handleShowCreate = () => setShowCreate(!showCreate)

    return (
        <>
            <div className={styles.searchAddCont}>
                <SearchInput />
                <button className={buttonStyles.addButton} onClick={handleShowCreate}>Añadir</button>
            </div>
            {showCreate && <DynamicForm tableSchema={tableShema} regiterData={formData} showCreate={handleShowCreate} />}
            <div className={styles.registersCont}>
                <DataTable data={data} />
            </div>
        </>
    )
}

export default Insumos