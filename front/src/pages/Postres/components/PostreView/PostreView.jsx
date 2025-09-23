import { useState, useEffect } from 'react'
import styles from './PostreView.module.css'
import buttonStyles from '../../../../styles/buttons.module.css'

import { useParams, useLocation } from 'react-router-dom'
import { useApi } from '../../../../hooks/useApi'

import { SHEMA_DB } from '../../../../utils/constants'


const PostreView = () => {

    // -----> EXTRAEMOS DATOS DE URL <-----
    const { postre } = useParams()
    const location = useLocation()
    const { id, name } = processUrl(location.pathname)

    // -----> SHEMAS <-----
    const tableSchema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'producto')

    const { fetchAll, fetchById, dataFrom, item, updateItem } = useApi(tableSchema)

    const [DataProceso, setDataProceso] = useState({})
    const [showModalEdit, setShowModalEdit] = useState(false)

    useEffect(() => {
        (async () => {
            await fetchById(id)
            await fetchAll('insumo')
            await fetchAll('tamanio')
            await fetchAll("producto_insumo")
        })()
    }, [])

    useEffect(() => {
        console.log('ITEM DESDE POSTREVIEW: ', item)
        if (item?.datos_proceso) setDataProceso(item?.datos_proceso)
    }, [item])


    const handleShowModalEdit = () => {
        setShowModalEdit(!showModalEdit)
    }


    // const handleUpdate = () => {
    //     try {
    //         const parsedData = JSON.parse(editDataProceso)
    //         const updatedItem = { ...item, DatosProceso: parsedData }
    //         updateItem(item.Id, updatedItem)
    //     } catch (error) {
    //         alert('JSON inválido. Revisa el formato.')
    //     }
    // }

    if (!item) return <p>Cargando postre...</p>

    return (
        <div className={styles.container}>
            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${item.url_imagen})` }}
            >
                <div className={styles.overlay}>
                    <h1 className={styles.title}>{item.nombre}</h1>
                    <p className={styles.description}>{item.descripcion}</p>
                </div>
            </div>

            <div className={styles.details}>
                <p><strong>Creado:</strong> {new Date(item.fecha_creacion).toLocaleString()}</p>
                <div className={styles.precioCont}>
                    <p><strong>Precio ➜</strong> ${item.precio_venta}</p>
                    <p><strong>Tamaño ➜</strong> {dataFrom['tamanio']?.find((t) => t.id === item.tamanio_id)?.nombre}</p>
                </div>

                <div className={styles.datosProcesoCont}>
                    <div className={styles.titleBtnCont}>
                        <h2>Datos del proceso</h2>
                        <button className={buttonStyles.searchButton} onClick={handleShowModalEdit}><i className="fa-solid fa-pen-to-square"></i></button>
                    </div>
                    <section className={styles.ingrentesSection}>
                        <h3>Ingredientes</h3>

                        {!dataFrom["producto_insumo"] ? (
                            <p>No se han registrado ingredientes.</p>
                        ) : (
                            <div className={styles.ingredientesCont}>
                                {dataFrom["producto_insumo"]?.map((item, index) => {

                                    if (item.producto_id != id) return

                                    const insumo = dataFrom["insumo"]?.find(i => i.id === item.insumo_id);
                                    return (
                                        <div key={index} className={styles.ingredienteCont}>
                                            <span> {insumo?.nombre || 'Insumo desconocido'}</span>
                                            <span>{item.cantidad_usada}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Capas */}
                    <section className={styles.capasSection}>
                        <h3>Capas</h3>
                        {!DataProceso?.capas && DataProceso?.capas === undefined ? (
                            <p>No hay capas definidas.</p>
                        ) : (
                            <div className={styles.capasContainer}>
                                {Object.entries(DataProceso.capas).map(([nombreCapa, info], idx) => {
                                    console.log('Info de la capa:', info);
                                    const nameIngrediente = dataFrom['insumo']?.find(i => i.id == info?.ingrediente)?.nombre || 'Insumo desconocido';

                                    return <div key={idx} className={styles.capaItem}>
                                        <strong>{nombreCapa}:</strong> {nameIngrediente} - {info.cantidad}
                                    </div>
                                })}
                            </div>
                        )}
                    </section>

                    {/* Notas */}
                    {DataProceso?.notas && (
                        <section className={styles.notasSection}>
                            <h3>Notas</h3>
                            <p className={styles.notas}>{notas}</p>
                        </section>
                    )}

                    {showModalEdit && (
                        <div className={styles.modalOverlay}>
                            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleShowModalEdit}><i className="fa-solid fa-xmark"></i></button>
                            <form
                                className={styles.formCont}
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleUpdate()
                                }}
                            >
                                <select name="" id="">
                                    {dataFrom['insumo'].map((insumo, idx) => (
                                        <option key={idx} value={insumo.Id}>{insumo.Nombre}</option>
                                    ))}
                                </select>

                                <button className={buttonStyles.searchButton} type="submit">
                                    Guardar DatosProceso
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostreView

const processUrl = (url) => {
    const parts = url.split('/');
    const slug = parts[parts.length - 1];

    const lastDashIndex = slug.lastIndexOf('-');
    const name = decodeURIComponent(slug.slice(0, lastDashIndex));
    const id = slug.slice(lastDashIndex + 1);

    return { id, name };
};