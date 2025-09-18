import { useEffect, useState } from 'react'

import styles from './Plantillas.module.css'
import buttonStyles from '../../styles/buttons.module.css'

import PlantillaCard from './components/PlantillaCard/PlantillaCard.jsx'
import SearchInput from '../../components/SearchInput/SearchInput'

import { SHEMA_DB } from '../../utils/constants'
import { useApi } from '../../hooks/useApi'
import AddPlantillaModal from './components/AddPlantillaModal/AddPlantillaModal.jsx' // 👈 importar el nuevo modal

const Plantillas = () => {
    // OJO: acá usabas "postres", pero realmente queremos la tabla producto
    const tableSchema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'producto')

    const { data, fetchAll } = useApi(tableSchema)
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        (async () => {
            await fetchAll()
        })()
    }, [])

    const [plantillas, setPlantillas] = useState([])

    useEffect(() => {
        if (Array.isArray(data)) {
            setPlantillas(data.filter((p) => p.es_plantilla))
        } else {
            setPlantillas([])
        }
    }, [data])

    const handleShowCreate = () => setShowCreate(!showCreate)

    const handleRefresh = async () => {
        await fetchAll()
        setShowCreate(false)
    }

    return (
        <>
            <div className={styles.searchAddCont}>
                <SearchInput />
                <button
                    className={`${buttonStyles.addButton} ${styles.addButton}`}
                    onClick={handleShowCreate}
                >
                    Añadir plantilla
                </button>
            </div>

            {/* Modal de creación de plantillas */}
            {showCreate && (
                <AddPlantillaModal
                    handleShowModal={handleShowCreate}
                    handleRefresh={handleRefresh}
                />
            )}

            {!plantillas || plantillas.length === 0 ? (
                <span className={styles.msgWithoutData}>Aún no hay plantillas creadas</span>
            ) : (
                <div className={styles.cardCont}>
                    {plantillas.map((element) => (
                        <PlantillaCard
                            key={element.id}
                            id={element.id}
                            title={element.nombre}
                            desc={element.descripcion}
                            img={element.url_imagen}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default Plantillas
