import { pool } from "../database/db.js";

export const getAllOrders = async () => {
    try {
        const query = `SELECT * FROM pedido`;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        return { error: 'Error al obtener los pedidos' };
    }
};

export const getOrderById = async (id) => {
    try {
        const query = `
      SELECT p.*, u.nombre AS nombreusuario
      FROM pedido p
      JOIN usuario u ON u.id = p.usuarioid
      WHERE p.id = $1
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const pedido = await pool.query(query, [id]);

        const query2 = `
      SELECT pd.*, pr.nombre AS nombreproducto
      FROM pedido_detalle pd
      JOIN producto pr ON pr.id = pd.productoid
      WHERE pd.pedidoid = $1
    `;
        console.log(`----> EJECUTANDO QUERY... "${query2}"`);

        const detalles = await pool.query(query2, [id]);

        return [{ pedido: pedido.rows[0], detalles: detalles.rows }];
    } catch (err) {
        return { error: err.message };
    }
};

export const createOrder = async (data) => {
    const { UsuarioID, productos } = data;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const query = `
      INSERT INTO pedido (usuario_id, estado)
      VALUES ($1, 'PENDIENTE')
      RETURNING id
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const pedidoResult = await client.query(query, [UsuarioID]);
        const pedidoId = pedidoResult.rows[0].id;

        const insumosCompuestosRes = await client.query(`SELECT id FROM insumo WHERE compuesto = true`);
        const idsCompuestos = insumosCompuestosRes.rows.map(row => row.id);

        const composicionesRes = await client.query(`SELECT * FROM insumo_composicion`);
        const composiciones = composicionesRes.rows;

        for (const item of productos) {
            const productoId = parseInt(item.ProductoID);
            const cantidad = parseFloat(item.Cantidad);

            if (!productoId || isNaN(cantidad)) {
                throw new Error(`Datos inválidos en el producto: ${JSON.stringify(item)}`);
            }

            const query3 = `
        INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad)
        VALUES ($1, $2, $3)
      `;
            console.log(`----> EJECUTANDO QUERY... "${query3}"`);
            await client.query(query3, [pedidoId, productoId, cantidad]);

            const insumosResult = await client.query(`
        SELECT insumo_id, cantidad
        FROM producto_insumo
        WHERE producto_id = $1
      `, [productoId]);

      console.log("INSUMOS A USAR:", insumosResult.rows);

            for (const insumo of insumosResult.rows) {
                const cantidadTotal = insumo.cantidadusada * cantidad;

                if (idsCompuestos.includes(insumo.insumo_id)) {
                    const ingredientes = composiciones.filter(c => c.insumocompuestoid === insumo.insumo_id);

                    for (const ing of ingredientes) {
                        const cantidadFinal = cantidadTotal * ing.cantidadporgramo;

                        await client.query(`
              UPDATE insumo
              SET cantidad_disponible = cantidad_disponible - $1,
                  fecha_actualizacion = NOW()
              WHERE id = $2
            `, [cantidadFinal, ing.ingredienteid]);

                        await client.query(`
              INSERT INTO log_insumo (insumo_id, usuario_id, tipo_movimiento, cantidad, motivo)
              VALUES ($1, $2, 'SALIDA', $3, $4)
            `, [
                            ing.ingredienteid,
                            UsuarioID,
                            cantidadFinal,
                            `Producción del producto ID ${productoId} (pedido ${pedidoId})`
                        ]);
                    }
                } else {
                    await client.query(`
            UPDATE insumo
            SET cantidad_disponible = cantidad_disponible - $1,
                fecha_actualizacion = NOW()
            WHERE id = $2
          `, [cantidadTotal, insumo.insumo_id]);

                    await client.query(`
            INSERT INTO log_insumo (insumo_id, usuario_id, tipo_movimiento, cantidad, motivo)
            VALUES ($1, $2, 'SALIDA', $3, $4)
          `, [
                        insumo.insumo_id,
                        UsuarioID,
                        cantidadTotal,
                        `Producción del producto ID ${productoId} (pedido ${pedidoId})`
                    ]);
                }
            }
        }

        await client.query('COMMIT');
        return { success: true, pedidoId };
    } catch (error) {
        console.error('Error en creación de pedido:', error);
        await client.query('ROLLBACK');
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
};

export const updateOrderState = async (id, data) => {
    const { Estado } = data;
    const client = await pool.connect();

    try {
        await client.query(`
      UPDATE pedido
      SET estado = $1
      WHERE id = $2
    `, [Estado, id]);

        console.log(`✅ Estado del pedido ${id} actualizado a ${Estado}`);
        if (Estado === "cancelado") {
            console.log("ENTRAMOS A CREAR FACTURA");

            const existing = await client.query(
                "SELECT * FROM factura WHERE pedidoid = $1",
                [id]
            );

            if (existing.rows.length === 0) {
                const totalResult = await client.query(`
          SELECT SUM(pd.cantidad * pr.precioventa) AS total
          FROM pedido_detalle pd
          JOIN producto pr ON pr.id = pd.productoid
          WHERE pd.pedidoid = $1
        `, [id]);

                const total = totalResult.rows[0]?.total || 0;

                await client.query(`
          INSERT INTO factura (pedidoid, total, metodopago, estado)
          VALUES ($1, $2, $3, $4)
        `, [id, total, "efectivo", "pagado"]);

                console.log(`✅ Factura creada para pedido ${id}`);
            }
        }

        return { success: true, message: "Estado actualizado correctamente" };
    } catch (error) {
        console.error("💥 Error al actualizar estado:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
};
