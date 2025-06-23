import { useState, useEffect } from 'react';
import styles from './AddPostreModal.module.css';
import buttonStyles from '../../../../styles/buttons.module.css';
import { useApi } from '../../../../hooks/useApi';
import { SHEMA_DB, PRODUCT_DETAILS } from '../../../../utils/constants';


const AddPostreModal = ({ handleShowModal, handleRefresh }) => {
    const tableSchema = SHEMA_DB.tables.find(element => element.namedb?.toLowerCase() === 'producto');
    const { namedb: tableName, columns, relations } = tableSchema;

    const { ingredientes: shemaingredientes, capas: shemaCapas } = PRODUCT_DETAILS;

    const [ingredientes, setIngredientes] = useState(shemaingredientes);
    const [capas, setCapa] = useState(shemaingredientes);
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const { dataFrom, fetchAll, createItem } = useApi(tableSchema);

    useEffect(() => {
        const firstCall = async () => {
            await fetchAll('Insumo');
        };
        firstCall();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (file) => {
        if (!file) {
            console.error("⚠️ No se proporcionó archivo para subir.");
            return;
        }

        const formDataImg = new FormData();
        formDataImg.append("file", file);
        formDataImg.append("upload_preset", "unsigned_preset"); // Asegúrate que este es válido

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dkhznoxbv/image/upload", {
                method: "POST",
                body: formDataImg,
            });

            const data = await res.json();
            console.log("📦 Respuesta de Cloudinary:", data);

            if (!res.ok) throw new Error(data.error?.message || "Error desconocido");

            setFormData(prev => ({ ...prev, UrlImagen: data.secure_url }));
            setImagePreview(data.secure_url);

            // Aquí sigue con la transformación
        } catch (err) {
            console.error("💥 Error subiendo la imagen:", err.message);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleIngredienteSubmit = (e) => {
        e.preventDefault();
        const ingrediente = formData['ingrediente'];
        const cantidad = formData["ingrediente-cantidad"];
        if (!ingrediente || !cantidad) return;
        const nuevo = { "insumoId": ingrediente, cantidad };
        setIngredientes([...ingredientes, nuevo]);
    };

    const handleCapaSubmit = (e) => {
        e.preventDefault();
        const ingrediente = formData['capa'];
        const cantidad = formData["capa-cantidad"];
        if (!ingrediente || !cantidad) return;
        const capaCount = Object.keys(capas).length;
        const nuevaClave = `capa${capaCount + 1}`;
        const nuevaCapa = {
            ...capas,
            [nuevaClave]: { ingrediente, cantidad },
        };
        setCapa(nuevaCapa);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData, insumos: ingredientes, DatosProceso: JSON.stringify({ capas }) };
            delete dataToSend?.capa;
            delete dataToSend?.ingrediente;
            if ("capa-cantidad" in dataToSend) delete dataToSend["capa-cantidad"];
            if ("ingrediente-cantidad" in dataToSend) delete dataToSend["ingrediente-cantidad"];
            console.log("Datos a enviar:", dataToSend);

            await createItem(dataToSend);
            // await handleRefresh();
        } catch (e) {
            console.log("Error creando el producto: ", e);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleShowModal}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <form className={styles.formCont} onSubmit={handleSubmit}>
                <h2>Añadir postre</h2>

                {columns.map((column) => {
                    const { name, namedb, type, required } = column;
                    const excludedTypes = ['id', 'urlimagen']

                    if (excludedTypes.includes(namedb.toLowerCase())) return null;

                    return (
                        <div className={styles.inpCont} key={namedb}>
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
                    );
                })}
                <div
                    className={styles.imageDropZone}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <p>Arrastra una imagen aquí o</p>
                    <input type="file" accept="image/*" onChange={handleImageSelect} />
                    {imagePreview && <img src={imagePreview} alt="Vista previa" className={styles.imagePreview} />}
                </div>

                <h3>Ingredientes</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            id={`inp-ingrediente`}
                            className={styles.select}
                            name={`ingrediente`}
                            onChange={handleChange}
                            value={formData[`ingrediente`] || ''}
                        >
                            <option>Seleccione...</option>
                            {dataFrom["Insumo"]?.map((insumo, idx) => (
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
                        />
                        <label htmlFor={`inp-cantidad`}>Cantidad</label>
                    </div>
                    <input
                        type="button"
                        value="+"
                        className={`${buttonStyles.addButton} ${styles.addButton}`}
                        onClick={handleIngredienteSubmit}
                    />
                </div>

                <div className={styles.ingredientesCont}>
                    {ingredientes.map((ingrediente, idx) => (
                        <div key={idx} className={styles.ingredienteCont}>
                            <span>{dataFrom['Insumo'].find(e => e.Id == ingrediente.insumoId)?.Nombre}</span>
                            <span>{ingrediente.cantidad}g</span>
                        </div>
                    ))}
                </div>

                <h3>Capas</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            id={`inp-capa`}
                            className={styles.select}
                            name={`capa`}
                            required
                            onChange={handleChange}
                            value={formData[`capa`] || ''}
                        >
                            <option>Seleccione...</option>
                            {ingredientes.map((insumo, idx) => (
                                <option key={idx} value={insumo.Id}>{dataFrom['Insumo'].find(e => e.Id == insumo.insumoId)?.Nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inpCont}>
                        <input
                            id={`inp-capa-cantidad`}
                            name='capa-cantidad'
                            type='number'
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formData['capa-cantidad'] || ''}
                        />
                        <label htmlFor={`inp-cantidad`}>Cantidad</label>
                    </div>
                    <input
                        type="button"
                        value="+"
                        className={`${buttonStyles.addButton} ${styles.addButton}`}
                        onClick={handleCapaSubmit}
                    />
                </div>

                <div className={styles.ingredientesCont}>
                    {Object.entries(capas).map(([_, value], idx) => (
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
    );
};

export default AddPostreModal;
