import { useEffect, useState } from 'react'
import styles from "./Pedidos.module.css"
import buttonStyles from "../../styles/buttons.module.css"

import DataTable from '../../components/DataTable/DataTable'
import SearchInput from '../../components/SearchInput/SearchInput'
import DynamicForm from '../../components/DynamicForm/DynamicForm'

import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'

const Pedidos = () => {

    const tableShema = SHEMA_DB.tables.find(element => element.name?.toLowerCase() === 'pedidos')
    console.log('TABLESHEMA DESDE PEDIDOS: ', tableShema)

    const { data, fetchAll, fetchById, createItem, updateItem, deleteItem, loading, error, item } = useApi(tableShema)
    const [formData, setFormData] = useState({})
    const [showCreate, setShowCreate] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => { fetchAll() }, []);

    const handleShowCreate = () => setShowCreate(!showCreate)
    const handleCreate = () => createItem(formData)

    return (
        <>
            <div className={styles.searchAddCont}>
                <SearchInput />
                <button className={buttonStyles.addButton} onClick={handleShowCreate}>Añadir</button>
            </div>
            {showCreate && <DynamicForm tableShema={tableShema} showCreate={handleShowCreate} regiterData={formData}/>}
            <div className={styles.registersCont}>
                <DataTable data={data} />
            </div>
        </>
    )
}

export default Pedidos