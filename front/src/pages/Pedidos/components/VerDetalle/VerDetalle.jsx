import { useState, useEffect } from "react";
import styles from "./VerDetalle.module.css";
import buttonStyles from '../../../../styles/buttons.module.css'

import { useApi } from "../../../../hooks/useApi";

const PedidoDetalle = ({ pedidoId, tableSchema, handleShowDetalle , handleRefresh }) => {

    const { fetchById, item, updateItem } = useApi(tableSchema);

    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");
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
            setPedido(item.pedido);
            setDetalles(item.detalles);
            setEstado(item.pedido?.Estado || "pendiente");
        }
    }, [item]);

    const handleActualizarEstado = async () => {
        try {
            console.log("Actualizando estado: ", pedidoId, estado)
            await updateItem(pedidoId, { Estado: estado });
            handleRefresh();
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        }
        handleShowDetalle(null);
    };


    const handleCloseDetalle = () => {
        handleShowDetalle(null);
    };

    if (!pedido) return <div className={styles.loading}>Cargando pedido...</div>;

    return (
        <div className={styles.modalOverlay}>
            <button className={`${buttonStyles.deleteButton} ${styles.btnCloseModal}`} onClick={handleCloseDetalle}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className={styles.detalleCont}>
                <div className={styles.titleBtnCont}>
                    <h2 className={styles.title}>Pedido #{pedido.Id}</h2>
                    <button onClick={handleActualizarEstado} className={styles.btn} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>

                {mensaje && <p className={styles.feedbackMsg}>{mensaje}</p>}

                <div className={styles.infoBox}>
                    <p><strong>Usuario:</strong> {pedido.NombreUsuario}</p>
                    <p><strong>Fecha:</strong> {new Date(pedido.FechaPedido).toLocaleString()}</p>

                    <div className={styles.estadoSelector}>
                        {['pendiente', 'en preparacion', 'entregado', 'cancelado'].map((opcion) => (
                            <button
                                key={opcion}
                                className={`${styles.estadoBtn} ${estado === opcion ? styles.active : ''}`}
                                onClick={() => setEstado(opcion)}
                                type="button"
                            >
                                {opcion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.productosCont}>
                    <h3>Productos</h3>
                    <ul className={styles.listaProductos}>
                        {detalles?.map((item) => (
                            <li key={item.Id} className={styles.productoItem}>
                                {item.NombreProducto} x {item.Cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalle;
