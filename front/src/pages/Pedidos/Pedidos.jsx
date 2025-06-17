import { useEffect, useState } from 'react'
import styles from "./Pedidos.module.css"
import buttonStyles from "../../styles/buttons.module.css"

import DataTable from '../../components/DataTable/DataTable'
import SearchInput from '../../components/SearchInput/SearchInput'
import DynamicForm from '../../components/DynamicForm/DynamicForm'
import AddPedidoModal from './components/AddPedidioModal/AddPedidoModal'
import PedidoDetalle from './components/VerDetalle/VerDetalle'

import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'

const Pedidos = () => {

    const tableSchema = SHEMA_DB.tables.find(element => element.name?.toLowerCase() === 'pedidos')
    console.log('tableSchema DESDE PEDIDOS: ', tableSchema)

    const { data, fetchAll, fetchById, createItem, updateItem, deleteItem, loading, error, item } = useApi(tableSchema)
    const [formData, setFormData] = useState({})
    const [showCreate, setShowCreate] = useState(false)

    const [detalleId, setDetalleId] = useState(null)


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => { fetchAll() }, []);

    const handleVerDetalle = (pedidoId) => {
        setDetalleId(pedidoId)
    }

    const handleShowCreate = () => setShowCreate(!showCreate)

    const handleRefresh = () => fetchAll()

    return (
        <>
            <div className={styles.searchAddCont}>
                <SearchInput />
                <button className={`${buttonStyles.addButton} ${styles.addButton}`} onClick={handleShowCreate}>Añadir</button>
            </div>
            {showCreate && <AddPedidoModal handleShowCreate={handleShowCreate} handleRefresh={handleRefresh} />}
            {detalleId && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <PedidoDetalle pedidoId={detalleId} tableSchema={tableSchema}/>
                        <button onClick={() => setDetalleId(null)} className={buttonStyles.closeButton}>Cerrar</button>
                    </div>
                </div>
            )}
            <div className={styles.registersCont}>
                <DataTable data={data} getId={handleVerDetalle} />
            </div>
        </>
    )
}

export default Pedidos