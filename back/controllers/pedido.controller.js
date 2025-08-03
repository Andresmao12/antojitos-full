import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {

        const query = `SELECT * FROM Pedido`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pool = await sql.connect(config);
        const result = await pool.request().query(query);
        console.log(result.recordset)
        res.json(result.recordset);

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};

// GET /api/pedidos/:id
export const getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {

        const query = `SELECT p.*, u.Nombre AS NombreUsuario
        FROM Pedido p
        JOIN Usuario u ON u.Id = p.UsuarioID
        WHERE p.Id = @Id`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pool = await sql.connect(config);
        const pedido = await pool.request()
            .input('Id', sql.Int, id)
            .query(query);


        const query2 = `SELECT pd.*, pr.Nombre AS NombreProducto
        FROM Pedido_Detalle pd
        JOIN Producto pr ON pr.Id = pd.ProductoID
        WHERE pd.PedidoID = @PedidoID`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const detalles = await pool.request()
            .input('PedidoID', sql.Int, id)
            .query(query2);

        res.json([{ pedido: pedido.recordset[0], detalles: detalles.recordset }]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createPedido = async (req, res) => {
    const { UsuarioID, productos } = req.body;
    console.log("min: ", UsuarioID, "body: ", req.body);

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {

        await transaction.begin();

        // 1. Insertar pedido
        const query = ` INSERT INTO Pedido (UsuarioID, Estado)
                OUTPUT INSERTED.Id
                VALUES (@UsuarioID, 'pendiente')`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pedidoRequest = new sql.Request(transaction);
        const pedidoResult = await pedidoRequest
            .input('UsuarioID', sql.Int, UsuarioID)
            .query(query);

        const pedidoId = pedidoResult.recordset[0].Id;

        // Obtener insumos compuestos y su composición

        const query2 = `SELECT Id FROM Insumo WHERE Compuesto = 1`
        console.log(`----> EJECUTANDO QUERY... "${query2}"`)

        const insumosCompuestosRes = await transaction.request().query(query2);
        const idsCompuestos = insumosCompuestosRes.recordset.map(row => row.Id);

        const composicionesRes = await transaction.request().query(`SELECT * FROM Insumo_Composicion`);
        const composiciones = composicionesRes.recordset;

        // 2. Procesar cada producto
        for (const item of productos) {
            const productoId = parseInt(item.ProductoID);
            const cantidad = parseFloat(item.Cantidad);

            if (!productoId || isNaN(cantidad)) {
                throw new Error(`Datos inválidos en el producto: ${JSON.stringify(item)}`);
            }

            // 2.1 Insertar detalle del pedido
            const query3 = `INSERT INTO Pedido_Detalle (PedidoID, ProductoID, Cantidad)
                    VALUES (@PedidoID, @ProductoID, @Cantidad)`
            console.log(`----> EJECUTANDO QUERY... "${query3}"`)

            await transaction.request()
                .input('PedidoID', sql.Int, pedidoId)
                .input('ProductoID', sql.Int, productoId)
                .input('Cantidad', sql.Decimal(12, 2), cantidad)
                .query(query3);

            // 2.2 Consultar insumos para este producto
            const insumosResult = await transaction.request()
                .input('ProdID', sql.Int, productoId)
                .query(`
                    SELECT InsumoID, CantidadUsada
                    FROM Producto_Insumo
                    WHERE ProductoID = @ProdID
                `);

            for (const insumo of insumosResult.recordset) {
                const cantidadTotal = insumo.CantidadUsada * cantidad;

                if (idsCompuestos.includes(insumo.InsumoID)) {
                    // Es compuesto, expandir ingredientes
                    const ingredientes = composiciones.filter(c => c.InsumoCompuestoID === insumo.InsumoID);

                    for (const ing of ingredientes) {
                        const cantidadFinal = cantidadTotal * ing.CantidadPorGramo;

                        await transaction.request()
                            .input('InsumoID', sql.Int, ing.IngredienteID)
                            .input('Cantidad', sql.Decimal(12, 2), cantidadFinal)
                            .query(`
                                UPDATE Insumo
                                SET CantidadDisponible = CantidadDisponible - @Cantidad,
                                    FechaActualizacion = GETDATE()
                                WHERE Id = @InsumoID
                            `);

                        await transaction.request()
                            .input('InsumoID', sql.Int, ing.IngredienteID)
                            .input('UsuarioID', sql.Int, UsuarioID)
                            .input('TipoMovimiento', sql.NVarChar, 'salida')
                            .input('Cantidad', sql.Decimal(12, 2), cantidadFinal)
                            .input('Motivo', sql.NVarChar, `Producción del producto ID ${productoId} (pedido ${pedidoId})`)
                            .query(`
                                INSERT INTO Log_Insumo (InsumoID, UsuarioID, TipoMovimiento, Cantidad, Motivo)
                                VALUES (@InsumoID, @UsuarioID, @TipoMovimiento, @Cantidad, @Motivo)
                            `);
                    }
                } else {
                    // No compuesto, descontar normalmente
                    await transaction.request()
                        .input('InsumoID', sql.Int, insumo.InsumoID)
                        .input('Cantidad', sql.Decimal(12, 2), cantidadTotal)
                        .query(`
                            UPDATE Insumo
                            SET CantidadDisponible = CantidadDisponible - @Cantidad,
                                FechaActualizacion = GETDATE()
                            WHERE Id = @InsumoID
                        `);

                    await transaction.request()
                        .input('InsumoID', sql.Int, insumo.InsumoID)
                        .input('UsuarioID', sql.Int, UsuarioID)
                        .input('TipoMovimiento', sql.NVarChar, 'salida')
                        .input('Cantidad', sql.Decimal(12, 2), cantidadTotal)
                        .input('Motivo', sql.NVarChar, `Producción del producto ID ${productoId} (pedido ${pedidoId})`)
                        .query(`
                            INSERT INTO Log_Insumo (InsumoID, UsuarioID, TipoMovimiento, Cantidad, Motivo)
                            VALUES (@InsumoID, @UsuarioID, @TipoMovimiento, @Cantidad, @Motivo)
                        `);
                }
            }
        }

        await transaction.commit();
        res.status(200).json({ success: true, pedidoId });

    } catch (error) {
        console.error('Error en creación de pedido:', error);
        await transaction.rollback();
        res.status(500).json({ success: false, error: error.message });
    }
};


export const updateEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { Estado } = req.body;

    try {
        const pool = await sql.connect(config);

        // 1. Actualizar estado del pedido
        await pool.request()
            .input("Id", sql.Int, id)
            .input("Estado", sql.NVarChar, Estado)
            .query(`
        UPDATE Pedido
        SET Estado = @Estado
        WHERE Id = @Id
      `);

        console.log(`✅ Estado del pedido ${id} actualizado a ${Estado}`);
        if (Estado === "cancelado") {
            console.log("ENTRAMOS A CREAR FACTURA")

            const existing = await pool.request()
                .input("PedidoID", sql.Int, id)
                .query("SELECT * FROM Factura WHERE PedidoID = @PedidoID");

            if (existing.recordset.length === 0) {
                // Calcular total
                const totalResult = await pool.request()
                    .input('PedidoID', sql.Int, id)
                    .query(`
    SELECT SUM(pd.Cantidad * pr.PrecioVenta) AS Total
    FROM Pedido_Detalle pd
    JOIN Producto pr ON pr.Id = pd.ProductoID
    WHERE pd.PedidoID = @PedidoID
  `);

                const total = totalResult.recordset[0]?.Total || 0;

                // Insertar la factura
                await pool.request()
                    .input("PedidoID", sql.Int, id)
                    .input("Total", sql.Decimal(10, 2), total)
                    .input("MetodoPago", sql.NVarChar, "efectivo") // Puedes cambiar esto si se especifica desde el frontend
                    .input("Estado", sql.NVarChar, "pagado") // O 'pendiente' si prefieres validarlo luego
                    .query(`
            INSERT INTO Factura (PedidoID, Total, MetodoPago, Estado)
            VALUES (@PedidoID, @Total, @MetodoPago, @Estado)
          `);

                console.log(`✅ Factura creada para pedido ${id}`);
            }
        }

        res.status(200).json({ success: true, message: "Estado actualizado correctamente" });
    } catch (error) {
        console.error("💥 Error al actualizar estado:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};