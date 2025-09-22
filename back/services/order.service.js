import { pool } from "../database/db.js";

export const getAllOrders = async () => {
    try {
        const query = `SELECT * FROM pedido`;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('-- Error al obtener pedidos:', error);
        return { error: 'Error al obtener los pedidos' };
    }
};

export const getOrderById = async (id) => {

    try {
        // Pedido
        const pedidoQuery = await pool.query(
            "SELECT * FROM pedido WHERE id = $1",
            [id]
        );

        if (pedidoQuery.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        // Detalles del pedido
        const detallesQuery = await pool.query(
            "SELECT * FROM pedido_detalle WHERE pedido_id = $1",
            [id]
        );

        // Factura asociada
        const facturaQuery = await pool.query(
            "SELECT * FROM factura WHERE pedido_id = $1",
            [id]
        );

        const result = [
            {
                pedido: pedidoQuery.rows[0],
                detalles: detallesQuery.rows,
                factura: facturaQuery.rows[0] || null,
            },
        ];

        return result;
    } catch (error) {
        console.error("❌ Error al obtener pedido:", error);
        }
};


export const createOrder = async (data) => {
    const { UsuarioID, productos } = data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Crear pedido en estado PENDIENTE
        const pedidoResult = await client.query(
            `INSERT INTO pedido (usuario_id, estado)
             VALUES ($1, 'PENDIENTE') RETURNING id`,
            [UsuarioID]
        );
        const pedidoId = pedidoResult.rows[0].id;

        // Obtener insumos compuestos y composiciones
        const idsCompuestosRes = await client.query(`SELECT id FROM insumo WHERE compuesto = true`);
        const idsCompuestos = idsCompuestosRes.rows.map(r => r.id);
        const composicionesRes = await client.query(`SELECT * FROM insumo_composicion`);
        const composiciones = composicionesRes.rows;

        const faltantes = [];

        for (const item of productos) {
            const productoId = parseInt(item.ProductoID);
            const cantidad = parseFloat(item.Cantidad);

            if (!productoId || isNaN(cantidad)) {
                throw new Error(`Datos inválidos en el producto: ${JSON.stringify(item)}`);
            }

            // Insert detalle
            await client.query(
                `INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad)
                 VALUES ($1, $2, $3)`,
                [pedidoId, productoId, cantidad]
            );

            // Obtener insumos del producto
            const insumosResult = await client.query(
                `SELECT insumo_id, cantidad AS cantidad_usada
                 FROM producto_insumo WHERE producto_id = $1`,
                [productoId]
            );

            for (const insumo of insumosResult.rows) {
                const cantidadTotal = insumo.cantidad_usada * cantidad;

                const stockRes = await client.query(
                    `SELECT cantidad_disponible, cantidad_reservada, precio_gramo
                     FROM insumo WHERE id = $1`,
                    [insumo.insumo_id]
                );
                const { cantidad_disponible, cantidad_reservada, precio_gramo } = stockRes.rows[0];
                const stockLibre = cantidad_disponible - cantidad_reservada;

                if (stockLibre < cantidadTotal) {
                    faltantes.push({
                        insumo_id: insumo.insumo_id,
                        faltante: cantidadTotal - stockLibre,
                        costo_faltante: (cantidadTotal - stockLibre) * precio_gramo
                    });
                }

                // Reservar insumo
                await client.query(
                    `UPDATE insumo
                     SET cantidad_reservada = cantidad_reservada + $1,
                         fecha_actualizacion = NOW()
                     WHERE id = $2`,
                    [cantidadTotal, insumo.insumo_id]
                );

                // Log reserva
                await client.query(
                    `INSERT INTO log_insumo (insumo_id, usuario_id, tipo_movimiento, cantidad, motivo)
                     VALUES ($1, $2, 'RESERVA', $3, $4)`,
                    [
                        insumo.insumo_id,
                        UsuarioID,
                        cantidadTotal,
                        `Reserva por pedido ${pedidoId}, producto ${productoId}`
                    ]
                );
            }
        }

        // 2. Calcular total del pedido
        const totalResult = await client.query(
            `SELECT SUM(pd.cantidad * pr.precio_venta) AS total
             FROM pedido_detalle pd
             JOIN producto pr ON pr.id = pd.producto_id
             WHERE pd.pedido_id = $1`,
            [pedidoId]
        );
        const total = totalResult.rows[0]?.total || 0;

        // 3. Crear factura en estado PENDIENTE (metodo_pago se define luego en front)
        await client.query(
            `INSERT INTO factura (pedido_id, total, metodo_pago, estado)
             VALUES ($1, $2, $3, $4)`,
            [pedidoId, total, "EFECTIVO", "PENDIENTE"] // EFECTIVO por defecto, editable desde front
        );

        await client.query("COMMIT");
        return { success: true, pedidoId, faltantes };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en creación de pedido:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
};

export const updateOrderState = async (id, data) => {
    const client = await pool.connect();
    let Estado = data.Estado.toUpperCase();
    if (Estado.includes(" ")) Estado = Estado.replace(" ", "_");

    try {
        await client.query("BEGIN");

        // 1. Actualizar estado del pedido
        await client.query(`UPDATE pedido SET estado = $1 WHERE id = $2`, [Estado, id]);

        // 2. Obtener detalles del pedido
        const detalles = await client.query(
            `SELECT producto_id, cantidad FROM pedido_detalle WHERE pedido_id = $1`,
            [id]
        );

        for (const detalle of detalles.rows) {
            const { producto_id, cantidad } = detalle;
            const insumosResult = await client.query(
                `SELECT insumo_id, cantidad AS cantidad_usada
                 FROM producto_insumo WHERE producto_id = $1`,
                [producto_id]
            );

            for (const insumo of insumosResult.rows) {
                const cantidadTotal = insumo.cantidad_usada * cantidad;

                if (Estado === "COMPLETADO") {
                    // 🔹 Convertir reserva en salida real
                    await client.query(
                        `UPDATE insumo
                         SET cantidad_disponible = cantidad_disponible - $1,
                             cantidad_reservada = cantidad_reservada - $1,
                             fecha_actualizacion = NOW()
                         WHERE id = $2`,
                        [cantidadTotal, insumo.insumo_id]
                    );

                    await client.query(
                        `INSERT INTO log_insumo (insumo_id, usuario_id, tipo_movimiento, cantidad, motivo)
                         VALUES ($1, (SELECT usuario_id FROM pedido WHERE id = $2), 'SALIDA', $3, $4)`,
                        [
                            insumo.insumo_id,
                            id,
                            cantidadTotal,
                            `Consumo real del pedido ${id}, producto ${producto_id}`
                        ]
                    );

                } else if (Estado === "CANCELADO") {
                    // 🔹 Liberar reserva
                    await client.query(
                        `UPDATE insumo
                         SET cantidad_reservada = cantidad_reservada - $1,
                             fecha_actualizacion = NOW()
                         WHERE id = $2`,
                        [cantidadTotal, insumo.insumo_id]
                    );

                    await client.query(
                        `INSERT INTO log_insumo (insumo_id, usuario_id, tipo_movimiento, cantidad, motivo)
                         VALUES ($1, (SELECT usuario_id FROM pedido WHERE id = $2), 'AJUSTE', $3, $4)`,
                        [
                            insumo.insumo_id,
                            id,
                            cantidadTotal,
                            `Reserva cancelada del pedido ${id}, producto ${producto_id}`
                        ]
                    );
                }
            }
        }

        await client.query("COMMIT");
        return { success: true, message: `Estado del pedido ${id} actualizado a ${Estado}` };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("💥 Error al actualizar estado:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
};
