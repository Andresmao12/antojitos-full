import { useState, useEffect } from "react";
import styles from "./AddInsumoModal.module.css";
import buttonStyles from "../../../../styles/buttons.module.css";
import { useApi } from "../../../../hooks/useApi";
import { SHEMA_DB } from "../../../../utils/constants";

const AddInsumoModal = ({ handleShowModal, handleRefresh }) => {
    const [formData, setFormData] = useState({});
    const [ingredientes, setIngredientes] = useState([]);
    const [esCompuesto, setEsCompuesto] = useState(false);

    
    const tableShema = SHEMA_DB.tables.find(
        element => element.namedb?.toLowerCase() === "insumo"
    );
    const { fetchAll, createItem, dataFrom } = useApi(tableShema);

    useEffect(() => {
        fetchAll("Insumo");
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setFormData({ ...formData, [name]: finalValue });

        if (name === "compuesto") setEsCompuesto(checked);
    };

    const handleAddIngrediente = () => {
        const ingredienteId = formData["ingrediente"];
        const cantidadPorGramo = formData["ingrediente-cantidad"];

        if (!ingredienteId || !cantidadPorGramo) return;

        const nuevo = {
            insumoId: parseInt(ingredienteId),
            cantidadPorGramo: parseFloat(cantidadPorGramo),
        };

        setIngredientes([...ingredientes, nuevo]);
        setFormData({
            ...formData,
            ingrediente: "",
            "ingrediente-cantidad": "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const insumoPayload = {
            nombre: formData.nombre,
            proveedor: formData.proveedor,
            cantidad_unidad: parseFloat(formData.cantidad_unidad),
            precio_unidad: parseFloat(formData.precio_unidad),
            compuesto: esCompuesto,
            cantidad_disponible: parseFloat(formData.cantidad_disponible || 0),
            ingredientes: esCompuesto ? ingredientes : [],
        };

        console.log("PAYLOAD INSUMO: ", insumoPayload);

        try {
            await createItem(insumoPayload);
            await handleRefresh();
            handleShowModal();
        } catch (error) {
            console.error("Error creando insumo:", error);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <button
                className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`}
                onClick={handleShowModal}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>

            <form className={styles.formCont} onSubmit={handleSubmit}>
                <h2>Registrar Insumo</h2>

                <div className={styles.inpCont}>
                    <input name="nombre" placeholder=" " onChange={handleChange} required />
                    <label htmlFor="nombre">Nombre</label>
                </div>

                <div className={styles.inpCont}>
                    <input name="proveedor" placeholder=" " onChange={handleChange} required />
                    <label htmlFor="proveedor">Proveedor</label>
                </div>

                <div className={styles.inpCont}>
                    <input
                        name="cantidad_unidad"
                        type="number"
                        step="0.01"
                        placeholder=" "
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="cantidad_unidad">Cantidad por unidad</label>
                </div>

                <div className={styles.inpCont}>
                    <input
                        name="precio_unidad"
                        type="number"
                        step="0.01"
                        placeholder=" "
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="precio_unidad">Precio por unidad</label>
                </div>

                <div className={styles.inpCont}>
                    <input
                        name="cantidad_disponible"
                        type="number"
                        step="0.01"
                        placeholder=" "
                        onChange={handleChange}
                    />
                    <label htmlFor="cantidad_disponible">Cantidad disponible</label>
                </div>

                <div className={styles.checkboxWrapper}>
                    <label className={styles.switchLabel}>
                        ¿Es compuesto?
                        <input
                            type="checkbox"
                            name="compuesto"
                            checked={esCompuesto}
                            onChange={handleChange}
                            className={styles.switchInput}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                {esCompuesto && (
                    <>
                        <h3>Ingredientes</h3>
                        <div className={styles.inpGroup}>
                            <div className={styles.selectCont}>
                                <select
                                    name="ingrediente"
                                    className={styles.select}
                                    onChange={handleChange}
                                    value={formData.ingrediente || ""}
                                >
                                    <option>Seleccione ingrediente...</option>
                                    {dataFrom["Insumo"]?.filter(i => !i.compuesto).map((insumo) => (
                                        <option key={insumo.id} value={insumo.id}>
                                            {insumo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.inpCont}>
                                <input
                                    name="ingrediente-cantidad"
                                    type="number"
                                    step="0.01"
                                    placeholder=" "
                                    onChange={handleChange}
                                    value={formData["ingrediente-cantidad"] || ""}
                                />
                                <label htmlFor="ingrediente-cantidad">Cantidad por gramo</label>
                            </div>
                            <input
                                type="button"
                                value="+"
                                className={`${buttonStyles.addButton} ${styles.addButton}`}
                                onClick={handleAddIngrediente}
                            />
                        </div>

                        <div className={styles.ingredientesCont}>
                            {ingredientes.map((item, idx) => {
                                const insumo = dataFrom["Insumo"]?.find(i => i.id == item.insumoId);
                                return (
                                    <div key={idx} className={styles.ingredienteCont}>
                                        <span>{insumo?.nombre}</span>
                                        <span>{item.cantidadPorGramo} g</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <button type="submit" className={buttonStyles.searchButton}>
                    Guardar Insumo
                </button>
            </form>
        </div>
    );
};

export default AddInsumoModal;
