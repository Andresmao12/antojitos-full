

const DynamicModalForm = ({ tablaSchema, handleShowModal, handleRefresh }) => {
    return (

        <>
            <h3>{'Ingredientes'}</h3>
            <div className={styles.inpGroup} >
                <div className={styles.selectCont}>
                    <select
                        id={`inp-ingrediente`}
                        className={styles.select}
                        name={`ingrediente`}
                        placeholder=" "
                        onChange={handleChange}
                        value={formData[`ingrediente`] || ''}
                    >
                        <option>Seleccione...</option>
                        {(dataFrom["Insumo"]?.length > 0) && dataFrom['Insumo']?.map((insumo, idx) => (
                            <option key={idx} value={insumo.Id}>{insumo.Nombre} - {insumo.Proveedor}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inpCont}>
                    <input
                        id={`inp-ingrediente-cantidad`}
                        name="ingrediente-cantidad"
                        type='number'
                        placeholder=" "
                        onChange={handleChange}
                    // value={formData[namedb] || ''}
                    />

                    <label htmlFor={`inp-cantidad`}>{'Cantidad'}</label>
                </div>
                <input
                    type="button"
                    value="+"
                    className={`${buttonStyles.addButton} ${styles.addButton}`}
                    onClick={handleIngredienteSubmit}
                />
            </div>
        </>

    )
}

export default DyanmicModalForm