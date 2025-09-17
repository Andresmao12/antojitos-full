import { useState, useEffect } from "react"

import styles from "./Clientes.module.css"
import buttonStyles from "../../styles/buttons.module.css"

import DataTable from '../../components/DataTable/DataTable'
import SearchInput from '../../components/SearchInput/SearchInput'
import DynamicForm from "../../components/DynamicForm/DynamicForm"


import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'


const Clientes = () => {
    console.log('SHEMA_DB', SHEMA_DB)

    const tableSchema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'usuario')

    const { data, fetchAll, fetchById, createItem, updateItem, deleteItem, loading, error, item } = useApi(tableSchema)
    const [formData, setFormData] = useState({})
    const [showCreate, setShowCreate] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => { fetchAll() }, []);

    const handleShowCreate = () => setShowCreate(!showCreate)
    
    const handleRefresh = async () => {
        console.log("SE REFRESCO CORRECTAMENTE")
        await fetchAll()
        setShowCreate(false)
    }
    console.log("data", data)
    return (
        <>
            <div className={styles.searchAddCont}>
                <SearchInput />
                <button className={`${buttonStyles.addButton} ${styles.addButton}`} onClick={handleShowCreate}>Añadir</button>
            </div>
            {showCreate && <DynamicForm tableSchema={tableSchema} regiterData={formData} showCreate={handleShowCreate} handleRefresh={handleRefresh} />}
            <div className={styles.registersCont}>
                <DataTable data={data} schema={tableSchema}/>
            </div>
        </>
    )
}

export default Clientes