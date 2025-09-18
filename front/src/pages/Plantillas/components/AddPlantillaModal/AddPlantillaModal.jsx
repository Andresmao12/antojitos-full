import { useState, useEffect } from 'react';
import styles from './AddPlantillaModal.module.css';
import buttonStyles from '../../../../styles/buttons.module.css';
import { useApi } from '../../../../hooks/useApi';
import { SHEMA_DB } from '../../../../utils/constants';

const AddPlantillaModal = ({ handleShowModal, handleRefresh }) => {
    const tableSchema = SHEMA_DB.tables.find(t => t.namedb?.toLowerCase() === 'producto');
    const { columns } = tableSchema || {};

    const { fetchAll, createItem, dataFrom } = useApi(tableSchema);

    // ESTADOS
    const [ingredientes, setIngredientes] = useState([]); // [{ insumoId, cantidad }]
    const [capas, setCapas] = useState({}); // { capa1: { ingrediente, cantidad } }
    const [formData, setFormData] = useState({ es_plantilla: true }); // 👈 Siempre true
    const [imagePreview, setImagePreview] = useState(null);

    // CARGA INICIAL
    useEffect(() => {
        (async () => {
            try {
                await fetchAll('insumo');
                await fetchAll('tamanio');
            } catch (e) {
                console.error('Error haciendo los fetch', e);
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // MANEJO DE LA IMAGEN
    const UploadImage = async (e) => {
        e.preventDefault();
        let file = null;

        try { file = e.dataTransfer.files?.[0]; }
        catch { file = e.target.files?.[0]; }

        if (!file) return;
        const formDataImg = new FormData();
        formDataImg.append('file', file);
        formDataImg.append('upload_preset', 'unsigned_preset');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dkhznoxbv/image/upload', {
                method: 'POST',
                body: formDataImg,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Error upload');

            setFormData(prev => ({ ...prev, url_imagen: data.secure_url }));
            setImagePreview(data.secure_url);
        } catch (err) {
            console.error('Error uploading image', err);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    // INGREDIENTES
    const handleIngredienteSubmit = (e) => {
        e.preventDefault();
        const ingrediente = formData['ingrediente'];
        const cantidad = formData["ingrediente-cantidad"];
        if (!ingrediente || !cantidad) return;

        const nuevo = { insumoId: ingrediente, cantidad };
        setIngredientes([...ingredientes, nuevo]);
    };

    // CAPAS NORMALES
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
        setCapas(nuevaCapa);
    };

    // CAPA VACÍA
    const handleCapaVaciaSubmit = () => {
        const capaCount = Object.keys(capas).length;
        const nuevaClave = `capa${capaCount + 1}`;
        const nuevaCapa = {
            ...capas,
            [nuevaClave]: { ingrediente: null, cantidad: null },
        };
        setCapas(nuevaCapa);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                es_plantilla: true, // 👈 obligatorio
                insumos: ingredientes,
                datos_proceso: JSON.stringify({ capas }),
            };

            delete dataToSend.ingrediente;
            delete dataToSend['ingrediente-cantidad'];
            delete dataToSend.capa;
            delete dataToSend['capa-cantidad'];

            await createItem(dataToSend);
            await handleRefresh?.();
            handleShowModal();
        } catch (err) {
            console.error('Error creando plantilla', err);
        }
    };

    const excludedNamedb = ['id', 'url_imagen', 'fecha_creacion', 'datos_proceso', 'plantilla_id', 'es_plantilla'];

    return (
        <div className={styles.modalOverlay}>
            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleShowModal}>
                <i className="fa-solid fa-xmark"></i>
            </button>

            <form className={styles.formCont} onSubmit={handleSubmit}>
                <h2>Añadir plantilla</h2>

                {/* Inputs schema */}
                {Array.isArray(columns) && columns.map(col => {
                    const { name, namedb, required } = col;
                    if (!namedb) return null;
                    if (excludedNamedb.includes(namedb.toLowerCase())) return null;

                    return (
                        <div className={styles.inpCont} key={namedb}>
                            <input
                                id={`inp-${namedb}`}
                                name={namedb}
                                placeholder=" "
                                required={required}
                                onChange={handleChange}
                                value={formData[namedb] ?? ''}
                            />
                            <label htmlFor={`inp-${namedb}`}>{name}</label>
                        </div>
                    );
                })}

                {/* Tamaño */}
                <h3>Tamaño</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            id="inp-tamanio"
                            className={styles.select}
                            name="tamanio_id"
                            onChange={handleChange}
                            value={formData['tamanio_id'] ?? ''}
                        >
                            <option value="">Seleccione tamaño...</option>
                            {dataFrom['tamanio']?.map((element) => (
                                <option key={element.id} value={element.id}>
                                    {element.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Imagen */}
                <div className={styles.imageDropZone} onDrop={UploadImage} onDragOver={handleDragOver}>
                    <p>Arrastra una imagen aquí o</p>
                    <input type="file" accept="image/*" onChange={UploadImage} />
                    {imagePreview && <img src={imagePreview} alt="Vista previa" className={styles.imagePreview} />}
                </div>

                {/* Ingredientes */}
                <h3>Ingredientes</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            id="inp-ingrediente"
                            className={styles.select}
                            name="ingrediente"
                            onChange={handleChange}
                            value={formData['ingrediente'] ?? ''}
                        >
                            <option value="">Seleccione...</option>
                            {dataFrom['insumo']?.map((element) => (
                                <option key={element.id} value={element.id}>
                                    {element.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inpCont}>
                        <input id="inp-ingrediente-cantidad" name="ingrediente-cantidad" type="number" placeholder=" " onChange={handleChange} value={formData['ingrediente-cantidad'] ?? ''} />
                        <label htmlFor="inp-ingrediente-cantidad">Cantidad</label>
                    </div>

                    <input type="button" value="+" className={`${buttonStyles.addButton} ${styles.addButton}`} onClick={handleIngredienteSubmit} />
                </div>

                <div className={styles.ingredientesCont}>
                    {ingredientes.map((ingrediente, idx) => (
                        <div key={idx} className={styles.ingredienteCont}>
                            <span>{dataFrom['insumo']?.find(e => e.id == ingrediente.insumoId)?.nombre}</span>
                            <span>{ingrediente.cantidad}g</span>
                        </div>
                    ))}
                </div>

                {/* Capas */}
                <h3>Capas</h3>
                <div className={styles.inpGroup}>
                    <div className={styles.selectCont}>
                        <select
                            id={`inp-capa`}
                            className={styles.select}
                            name={`capa`}
                            onChange={handleChange}
                        >
                            <option>Seleccione...</option>
                            {ingredientes.map((insumo) => {
                                return <option key={insumo.insumoId} value={insumo.insumoId}> {dataFrom['insumo'].find(e => e.id == insumo.insumoId)?.nombre}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.inpCont}>
                        <input
                            id={`inp-capa-cantidad`}
                            name='capa-cantidad'
                            type='number'
                            placeholder=" "
                            onChange={handleChange}
                            value={formData['capa-cantidad'] || ''}
                        />
                        <label htmlFor={`inp-capa-cantidad`}>Cantidad</label>
                    </div>
                    <input
                        type="button"
                        value="+"
                        className={`${buttonStyles.addButton} ${styles.addButton}`}
                        onClick={handleCapaSubmit}
                    />
                    <input
                        type="button"
                        value="+ Capa vacía"
                        className={`${buttonStyles.addButton} ${styles.emptyLayerButton}`}
                        onClick={handleCapaVaciaSubmit}
                    />
                </div>

                <div className={styles.ingredientesCont}>
                    {Object.entries(capas).map(([key, value], idx) => {
                        const insumo = dataFrom['insumo']?.find(e => e.id == value.ingrediente);
                        return (
                            <div key={idx} className={styles.ingredienteCont}>
                                <span>
                                    {insumo ? insumo.nombre : '🔲 (Capa vacía)'}
                                </span>
                                <span>{value.cantidad ? `${value.cantidad}g` : ''}</span>
                            </div>
                        );
                    })}
                </div>

                <button className={buttonStyles.searchButton} type="submit">Guardar plantilla</button>
            </form>
        </div>
    );
};

export default AddPlantillaModal;
