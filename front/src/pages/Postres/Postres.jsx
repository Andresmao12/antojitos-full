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

    return (<>

        <div className={styles.searchAddCont}>
            <SearchInput />
            <button className={`${buttonStyles.addButton} ${styles.addButton}`} onClick={handleShowCreate}>Añadir</button>
        </div>

        {/* {showCreate && <DynamicForm tableShema={tableShema} regiterData={formData} showCreate={handleShowCreate} />} */}
        {showCreate && <AddPostreModal handleShowModal={handleShowCreate} handleRefresh={handleRefresh} />}

        <div className={styles.cardCont}>
            {Array.isArray(data) &&
                data.map((element, i) =>
                    <PostreCard key={i} id={element.Id} title={element.Nombre} desc={element.Descripcion} img={element.UrlImagen} tableShema={tableShema} />
                )}
        </div>
    </>
    )
}

export default Postres