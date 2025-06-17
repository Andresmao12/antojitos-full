import { useState, useEffect } from "react";
import styles from "./VerDetalle.module.css"; // crea este archivo .css

import { useApi } from "../../../../hooks/useApi";

const PedidoDetalle = ({ pedidoId, tableSchema }) => {

    const { fetchById, item } = useApi(tableSchema);
    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");
    const [detalles, setDetalles] = useState([]);

    useEffect(() => {
        const fetchPedido = async () => {
            await fetchById(pedidoId);
        };
        fetchPedido();
    }, [pedidoId]);

    useEffect(() => {
        console.log("ITEM EN USEE: ", item)
        if (item) {
            setPedido(item.pedido);
            setDetalles(item.detalles);
            setEstado(item.Estado);
        }
    }, [item]);

    const handleActualizarEstado = async () => {
        await fetch(`/api/pedido/${pedidoId}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado }),
        });
        alert("Estado actualizado");
    };

    if (!pedido) return <div className={styles.loading}>Cargando pedido...</div>;

    return (
        <div className={styles.detalleCont}>
            <div className={styles.titleBtnCont}>
                <h2 className={styles.title}>Pedido #{pedido.Id}</h2>
                <button onClick={handleActualizarEstado} className={styles.btn}>
                    Guardar cambios
                </button>
            </div>

            <div className={styles.infoBox}>
                <p><strong>Usuario:</strong> {pedido.NombreUsuario}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.FechaPedido).toLocaleString()}</p>

                <label className={styles.label}>
                    Estado:
                    <select
                        className={styles.select}
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="pendiente">pendiente</option>
                        <option value="preparado">preparado</option>
                        <option value="entregado">entregado</option>
                        <option value="pago">pago</option>
                    </select>
                </label>
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
    );
};

export default PedidoDetalle;
