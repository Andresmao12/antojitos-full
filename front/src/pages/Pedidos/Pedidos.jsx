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

    const { data, fetchAll } = useApi(tableSchema)
    const [showCreate, setShowCreate] = useState(false)

    const [detalleId, setDetalleId] = useState(null)

    useEffect(() => {
        (async () => await fetchAll())()
    }, []);

    useEffect(() => {
        console.log('DATA PEDIDOS = ', data)
        console.log('SHEMA PEDIDOS = ', tableSchema)
    }, [data, tableSchema])

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
            {detalleId && <PedidoDetalle pedidoId={detalleId} tableSchema={tableSchema} handleShowDetalle={handleVerDetalle} handleRefresh={handleRefresh} />}

            <div className={styles.registersCont}>
                <DataTable data={data} getId={handleVerDetalle} schema={tableSchema}/>
            </div>
        </>
    )
}

export default Pedidos