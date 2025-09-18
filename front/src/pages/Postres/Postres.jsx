import { useEffect, useState } from 'react'

import styles from './Postres.module.css'
import buttonStyles from '../../styles/buttons.module.css'

import PostreCard from './components/PostreCard/PostreCard'
import SearchInput from '../../components/SearchInput/SearchInput'
import AddPostreModal from './components/AddPostreModal/AddPostreModal'


import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'
import DynamicForm from '../../components/DynamicForm/DynamicForm'


const Postres = () => {

    const tableShema = SHEMA_DB.tables.find(element => element.name?.toLowerCase() === 'postres')

    tableShema.columns = tableShema.columns.filter(element => element.namedb.toLowerCase() != 'datosproceso')

    console.log('TableShema', tableShema)

    const { data, fetchAll, fetchById, createItem, updateItem, deleteItem, loading, error, item } = useApi(tableShema)
    const [formData, setFormData] = useState({})
    const [showCreate, setShowCreate] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const firstCall = async () => await fetchAll()
        firstCall()
    }, []);


    const handleShowCreate = () => setShowCreate(!showCreate)

    const handleRefresh = async () => {
        console.log("SE REFRESCO CORRECTAMENTE")
        await fetchAll()
        setShowCreate(false)
    }

    console.log(' DATA DESDE POSTRES: ', data)

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if (Array.isArray(data)) {
            setProductos(data.filter((p) => !p.es_plantilla));
        } else {
            setProductos([]);
        }
    }, [data]);

    return (<>

        <div className={styles.searchAddCont}>
            <SearchInput />
            <button className={`${buttonStyles.addButton} ${styles.addButton}`} onClick={handleShowCreate}>Añadir</button>
        </div>

        {/* {showCreate && <DynamicForm tableShema={tableShema} regiterData={formData} showCreate={handleShowCreate} />} */}
        {showCreate && <AddPostreModal handleShowModal={handleShowCreate} handleRefresh={handleRefresh} />}

        {(!productos || productos?.length == 0) ?
            <span className={styles.msgWithoutData}>Por aca no hay informacion</span>
            :
            <div className={styles.cardCont}>
                {productos.map((element, i) =>
                    <PostreCard key={i} id={element.id} title={element.nombre} desc={element.descripcion} img={element.url_imagen} tamanio={element.tamanio_id} tableShema={tableShema} />
                )}
            </div>}
    </>
    )
}

export default Postres