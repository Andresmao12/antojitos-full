import { useState, useEffect } from 'react'

import styles from './AddPostreModal.module.css'
import buttonStyles from '../../../../styles/buttons.module.css'

import { useApi } from '../../../../hooks/useApi'
import { SHEMA_DB, PRODUCT_DETAILS } from '../../../../utils/constants'

const AddPostreModal = ({ handleShowModal }) => {

    const tableSchema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'producto')
    const { namedb: tableName, columns, relations } = tableSchema

    const { ingredientes: shemaingredientes, capas: shemaCapas } = PRODUCT_DETAILS

    const [ingredientes, setIngredientes] = useState(shemaingredientes)
    const [capas, setCapa] = useState(shemaingredientes)

    const [formData, setFormData] = useState({});

    const { dataFrom, fetchAll, createItem } = useApi(tableSchema)

    useEffect(() => {
        const firstCall = async () => {
            await fetchAll('Insumo')
        }
        firstCall()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        console.log("FORMDATA: ", { ...formData, [name]: value })
    };


    const handleIngredienteSubmit = (e) => {
        e.preventDefault()
        const ingrediente = formData['ingrediente']
        const cantidad = formData["ingrediente-cantidad"]

        if (!ingrediente || !cantidad) return

        const nuevo = { "insumoId": ingrediente, cantidad }
        setIngredientes([...ingredientes, nuevo])

    }


    const handleCapaSubmit = (e) => {
        e.preventDefault()
        const ingrediente = formData['capa']
        const cantidad = formData["capa-cantidad"]

        if (!ingrediente || !cantidad) return

        const capaCount = Object.keys(capas).length;
        const nuevaClave = `capa${capaCount + 1}`;

        const nuevaCapa = {
            ...capas,
            [nuevaClave]: {
                ingrediente,
                cantidad
            }
        };

        setCapa(nuevaCapa);
    }

    const handleSubmit = (e) => {

        e.preventDefault()
        console.log("FORMDATA AL HACER SUBMIT: ", formData)
        if (!Object.entries(formData).filter(element => element != null)) return

        try {

            const dataToSend = formData
            dataToSend.insumos = ingredientes
            dataToSend.DatosProceso = JSON.stringify({ capas  })
            console.log("CAPA DATATOSEND: ", dataToSend)

            delete dataToSend?.capa
            delete dataToSend?.ingrediente
            if ("capa-cantidad" in dataToSend) delete dataToSend["capa-cantidad"]
            if ("ingrediente-cantidad" in dataToSend) delete dataToSend["ingrediente-cantidad"]

            createItem(dataToSend)
        } catch (e) {
            console.log("Error creando el producto: ", (e))
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleShowModal}><i className="fa-solid fa-xmark"></i></button>
            <form
                className={styles.formCont}
                onSubmit={handleSubmit}
            >
                <h2>Añadir postre</h2>
                {columns.map((column) => {
                    const { name, namedb, type, required } = column
                    if (namedb.toLowerCase() === 'id') return null

                    return (
                        <div className={styles.inpCont}>
                            <input
                                id={`inp-${namedb}`}
                                name={namedb}
                                placeholder=" "
                                required={required}
                                onChange={handleChange}
                                value={formData[namedb] || ''}
                            />

                            <label htmlFor={`inp-${namedb}`}>{name}</label>
                        </div>

                    )
                })}

                <h3>{'Ingredientes'}</h3>
                <div className={styles.inpGroup} >
                    <select
                        id={`inp-ingrediente`}
                        className={styles.select}
                        name={`ingrediente`}
                        placeholder=" "
                        required
                        onChange={handleChange}
                        value={formData[`ingrediente`] || ''}
                    >
                        {dataFrom['Insumo']?.map((insumo, idx) => (
                            <option key={idx} value={insumo.Id}>{insumo.Nombre}</option>
                        ))}
                    </select>
                    <div className={styles.inpCont}>
                        <input
                            id={`inp-cantidad`}
                            name="ingrediente-cantidad"
                            type='number'
                            placeholder=" "
                            required
                            onChange={handleChange}
                        // value={formData[namedb] || ''}
                        />

                        <label htmlFor={`inp-cantidad`}>{'Cantidad'}</label>
                    </div>
                    <button className={buttonStyles.addButton} onClick={handleIngredienteSubmit}>+</button>
                </div>
                <div className={styles.ingredientesCont}>
                    {ingredientes?.length > 0 && ingredientes.map((ingrediente, idx) => (
                        <div key={idx} className={styles.ingredienteCont}>
                            <span> {dataFrom['Insumo'].find(element => element.Id == ingrediente.insumoId).Nombre}</span>
                            <span>{ingrediente.cantidad}g</span>
                        </div>
                    ))}
                </div>
                <h3>{'Capas'}</h3>
                <div className={styles.inpGroup}>
                    <select
                        id={`inp-ingrediente`}
                        className={styles.select}
                        name={`capa`}
                        placeholder=" "
                        required={true}
                        onChange={handleChange}
                        value={formData[`capa`] || ''}
                    >
                        {(ingredientes.length > 0 && dataFrom["Insumo"].length > 0) && ingredientes?.map((insumo, idx) => (

                            <option className={styles.selectOption} key={idx} value={insumo.Id}>{dataFrom['Insumo'].find(element => element.Id == insumo.insumoId).Nombre}</option>
                        ))}
                    </select>
                    <div className={styles.inpCont}>
                        <input
                            id={`inp-cantidad`}
                            name='capa-cantidad'
                            type='number'
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formData['capa-cantidad'] || ''}
                        />

                        <label htmlFor={`inp-cantidad`}>{'Cantidad'}</label>
                    </div>
                    <input
                        type="button"
                        value="+"
                        className={buttonStyles.addButton}
                        onClick={handleCapaSubmit}
                    />
                </div>
                <div className={styles.ingredientesCont}>
                    {Object.entries(capas).length > 0 && Object.entries(capas).map(([_, value], idx) => (
                        <div key={idx} className={styles.ingredienteCont}>
                            <span>{value.ingrediente}</span>
                            <span>{value.cantidad}g</span>
                        </div>
                    ))}
                </div>
                <button className={buttonStyles.searchButton} type="submit">
                    Guardar DatosProceso
                </button>
            </form>
        </div>
    )
}

export default AddPostreModal
