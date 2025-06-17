import { useState, useEffect } from "react";

const PedidoDetalle = ({ pedidoId }) => {
    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");

    useEffect(() => {
        const fetchPedido = async () => {
            const res = await fetch(`/api/pedido/${pedidoId}`);
            const data = await res.json();
            setPedido(data.pedido);
            setEstado(data.pedido.Estado);
        };
        fetchPedido();
    }, [pedidoId]);

    const handleActualizarEstado = async () => {
        await fetch(`/api/pedido/${pedidoId}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado }),
        });
        alert("Estado actualizado");
    };

    if (!pedido) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Pedido #{pedido.Id}</h2>
            <p><strong>Usuario:</strong> {pedido.NombreUsuario}</p>
            <p><strong>Fecha:</strong> {new Date(pedido.FechaPedido).toLocaleString()}</p>

            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="pendiente">pendiente</option>
                <option value="preparado">preparado</option>
                <option value="entregado">entregado</option>
                <option value="pago">pago</option>
            </select>
            <button onClick={handleActualizarEstado}>Guardar cambios</button>

            <h3>Productos:</h3>
            <ul>
                {pedido.detalles.map((item) => (
                    <li key={item.Id}>{item.NombreProducto} x {item.Cantidad}</li>
                ))}
            </ul>
        </div>
    );
};


export default PedidoDetalle