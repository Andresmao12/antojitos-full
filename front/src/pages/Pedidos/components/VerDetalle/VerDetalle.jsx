import { useState, useEffect } from "react";
import styles from "./VerDetalle.module.css";
import buttonStyles from "../../../../styles/buttons.module.css";
import { useApi } from "../../../../hooks/useApi";

const PedidoDetalle = ({ pedidoId, tableSchema, handleShowDetalle, handleRefresh }) => {
    const { fetchById, item, updateItem } = useApi(tableSchema);

    const [pedido, setPedido] = useState(null);
    const [estadoActual, setEstadoActual] = useState("");
    const [estadoNuevo, setEstadoNuevo] = useState("");
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchPedido = async () => {
            await fetchById(pedidoId);
        };
        fetchPedido();
    }, [pedidoId]);

    useEffect(() => {
        if (item) {
            console.log("Item recibido en detalle:", item);
            setPedido(item.pedido);
            setDetalles(item.detalles);
            setEstadoActual(item.pedido?.estado || "PENDIENTE");
            setEstadoNuevo(item.pedido?.estado || "PENDIENTE");
        }
    }, [item]);

    const handleActualizarEstado = async () => {
        try {
            setLoading(true);
            console.log("Actualizando estado: ", pedidoId, estadoNuevo);
            await updateItem(pedidoId, { Estado: estadoNuevo });
            setEstadoActual(estadoNuevo); // reflejar en front
            handleRefresh();
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            setMensaje("❌ Error al guardar el estado");
        } finally {
            setLoading(false);
            handleShowDetalle(null);
        }
    };

    const handleCloseDetalle = () => {
        handleShowDetalle(null);
    };

    if (!pedido) return <div className={styles.loading}>Cargando pedido...</div>;

    const opciones = ["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"];

    return (
        <div className={styles.modalOverlay}>
            <button
                className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`}
                onClick={handleCloseDetalle}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className={styles.detalleCont}>
                <div className={styles.titleBtnCont}>
                    <h2 className={styles.title}>Pedido #{pedido.id}</h2>
                    <button
                        onClick={handleActualizarEstado}
                        className={styles.btn}
                        disabled={loading || estadoNuevo === estadoActual}
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>

                {mensaje && <p className={styles.feedbackMsg}>{mensaje}</p>}

                <div className={styles.infoBox}>
                    <p>
                        <strong>Usuario:</strong> {pedido.nombreusuario}
                    </p>
                    <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(pedido.fecha_pedido).toLocaleString()}
                    </p>

                    <div className={styles.estadoSelector}>
                        {opciones.map((opcion) => (
                            <button
                                key={opcion}
                                className={`${styles.estadoBtn}
                                    ${estadoActual === opcion ? styles.actual : ""}
                                    ${estadoNuevo === opcion && estadoActual !== opcion ? styles.nuevo : ""}
                                `}
                                onClick={() => setEstadoNuevo(opcion)}
                                type="button"
                            >
                                {opcion.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.productosCont}>
                    <h3>Productos</h3>
                    <ul className={styles.listaProductos}>
                        {detalles?.map((item) => (
                            <li key={item.id} className={styles.productoItem}>
                                {item.nombreproducto} x {item.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalle;
