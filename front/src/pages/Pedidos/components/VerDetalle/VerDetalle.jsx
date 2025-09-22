import { useState, useEffect } from "react";
import styles from "./VerDetalle.module.css";
import buttonStyles from "../../../../styles/buttons.module.css";
import { useApi } from "../../../../hooks/useApi";

const PedidoDetalle = ({ pedidoId, tableSchema, handleShowDetalle, handleRefresh }) => {
    const { fetchById, item, updateItem, fetchAll, dataFrom } = useApi(tableSchema);

    const [pedido, setPedido] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [factura, setFactura] = useState(null);

    const [estadoPedido, setEstadoPedido] = useState("");
    const [nuevoEstadoPedido, setNuevoEstadoPedido] = useState("");

    const [estadoFactura, setEstadoFactura] = useState("");
    const [nuevoEstadoFactura, setNuevoEstadoFactura] = useState("");
    const [metodoPago, setMetodoPago] = useState("");

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // Cargar pedido completo (pedido + detalles + factura)
    useEffect(() => {
        const fetchPedido = async () => {
            await fetchById(pedidoId);
            await fetchAll("producto");
        };
        fetchPedido();
    }, [pedidoId]);

    // Mapear datos al estado local
    useEffect(() => {
        if (item) {
            setPedido(item[0].pedido);
            setDetalles(item[0].detalles);

            setEstadoPedido(item[0].pedido?.estado || "PENDIENTE");
            setNuevoEstadoPedido(item[0].pedido?.estado || "PENDIENTE");

            if (item[0].factura) {
                setFactura(item[0].factura);
                setEstadoFactura(item[0].factura.estado);
                setNuevoEstadoFactura(item[0].factura.estado);
                setMetodoPago(item[0].factura.metodo_pago);
            }
        }
    }, [item]);

    // Guardar cambios unificados (pedido + factura)
    const handleGuardarCambios = async () => {
        try {
            setLoading(true);

            // Actualizar pedido si cambió
            if (nuevoEstadoPedido !== estadoPedido) {
                await updateItem(pedidoId, { Estado: nuevoEstadoPedido });
                setEstadoPedido(nuevoEstadoPedido);
            }

            // Actualizar factura si cambió
            if (factura && (nuevoEstadoFactura !== estadoFactura || metodoPago !== factura.metodo_pago)) {
                const res = await fetch(`${import.meta.env.VITE_API_ROUTE}/factura/${factura.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ metodo_pago: metodoPago, estado: nuevoEstadoFactura }),
                });

                if (!res.ok) throw new Error("Error al actualizar factura");

                const data = await res.json();
                setFactura(data);
                setEstadoFactura(data.estado);
                setNuevoEstadoFactura(data.estado);
                setMetodoPago(data.metodo_pago);
            }

            setMensaje("✅ Cambios guardados correctamente");
            handleRefresh();
        } catch (err) {
            console.error("Error al guardar cambios:", err);
            setMensaje("❌ Error al guardar cambios");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetalle = () => handleShowDetalle(null);

    if (!pedido) return <div className={styles.loading}>Cargando pedido...</div>;

    const opcionesPedido = ["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"];
    const opcionesFactura = ["PENDIENTE", "PAGO", "ANULADO"];
    const metodosPago = ["EFECTIVO", "TARJETA", "TRANSFERENCIA"];

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
                </div>

                {mensaje && <p className={styles.feedbackMsg}>{mensaje}</p>}

                <div className={styles.infoBox}>
                    <p><strong>Usuario:</strong> {pedido.nombreusuario}</p>
                    <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleString()}</p>

                    <div className={styles.estadoSelector}>
                        {opcionesPedido.map((opcion) => (
                            <button
                                key={opcion}
                                className={`${styles.estadoBtn}
                                    ${estadoPedido === opcion ? styles.actual : ""}
                                    ${nuevoEstadoPedido === opcion && estadoPedido !== opcion ? styles.nuevo : ""}
                                `}
                                onClick={() => setNuevoEstadoPedido(opcion)}
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
                        {detalles?.map((item) => {
                            const productoInfo = dataFrom["producto"]?.find(p => p.id === item.producto_id);
                            return (
                                <li key={item.id} className={styles.productoItem}>
                                    {(productoInfo?.nombre || item.nombreproducto) ?? "Producto desconocido"} x {item.cantidad}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {factura && (
                    <div className={styles.facturaCont}>
                        <h3>Factura #{factura.id}</h3>
                        <p><strong>Total:</strong> ${factura.total}</p>

                        <div className={styles.formGroup}>
                            <label>Método de Pago:</label>
                            <div className={styles.selectCont}>
                                <select
                                    className={styles.select}
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    {metodosPago.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Estado Factura:</label>
                            <div className={styles.estadoSelector}>
                                {opcionesFactura.map((opcion) => (
                                    <button
                                        key={opcion}
                                        className={`${styles.estadoBtn}
                                            ${estadoFactura === opcion ? styles.actual : ""}
                                            ${nuevoEstadoFactura === opcion && estadoFactura !== opcion ? styles.nuevo : ""}
                                        `}
                                        onClick={() => setNuevoEstadoFactura(opcion)}
                                        type="button"
                                    >
                                        {opcion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.actionsCont}>
                    <button
                        onClick={handleGuardarCambios}
                        className={styles.btnSave}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalle;
