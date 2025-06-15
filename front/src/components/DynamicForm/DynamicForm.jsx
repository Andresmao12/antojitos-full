import { useState, useEffect } from 'react'

import styles from './DynamicForm.module.css'
import buttonStyles from '../../styles/buttons.module.css'

import { useApi } from '../../hooks/useApi'


const DynamicForm = ({ tableSchema, regiterData, showCreate }) => {


    const { name: tableName, columns, relations } = tableSchema
    const { createItem, updateItem, loading, error, item } = useApi(tableSchema)

    console.log('tableSchema desde DynamicForm: ', tableSchema)
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleShowCreate = () => {
        showCreate(!showCreate)
    }
    const handleCreate = (e) => {
        e.preventDefault();

        const dataConDefaults = {};

        columns.forEach(({ namedb, valueDefault }) => {

            const valor = formData[namedb];

            dataConDefaults[namedb] = (valor !== undefined && valor !== '') ? valor : valueDefault;
        });

        createItem(dataConDefaults)
    }

    return (
        <form className={styles.formCreate} onSubmit={handleCreate}>
            <h2>{`Registrar ${tableName.toLowerCase()}`}</h2>

            {columns.map((column) => {
                const { name, namedb, type, required, readonly } = column

                if (readonly) return null

                if (['id', 'rol', "FechaActualizacion"].includes(namedb.toLowerCase())) return null

                return (
                    <div className={styles.inpCont}>
                        {type === 'string' && <input
                            id={`inp-${namedb}`}
                            name={namedb}
                            placeholder=" "
                            required={required}
                            onChange={handleChange}
                            value={formData[namedb] || ''}
                        />}
                        {type === 'number' && <input
                            id={`inp-${namedb}`}
                            type='number'
                            name={namedb}
                            placeholder=" "
                            required={required}
                            onChange={handleChange}
                            value={formData[namedb] || ''}
                        />}
                        {type === 'textarea' && <textarea
                            id={`inp-${namedb}`}
                            name={namedb}
                            placeholder=" "
                            required={required}
                            className={styles.textarea}
                            onChange={handleChange}
                            value={formData[namedb] || ''}
                        />}

                        <label htmlFor={`inp-${namedb}`}>{name}</label>
                    </div>

                )
            })}

            {/* {relations && relations.map((relation) => {})} */}

            <div className={styles.btnGroup}>
                <button type='button' className={`${buttonStyles.deleteButton} ${styles.submitCreateBtn}`} onClick={handleShowCreate}>Cerrar</button>
                <button type="submit" className={`${buttonStyles.searchButton} ${styles.submitCreateBtn}`}>Guardar {tableName}</button>
            </div>
        </form>
    )
}

export default DynamicForm