import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Pedido');
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
        const pool = await sql.connect(config);
        const pedido = await pool.request()
            .input('Id', sql.Int, id)
            .query(`
        SELECT p.*, u.Nombre AS NombreUsuario
        FROM Pedido p
        JOIN Usuario u ON u.Id = p.UsuarioID
        WHERE p.Id = @Id
      `);

        const detalles = await pool.request()
            .input('PedidoID', sql.Int, id)
            .query(`
        SELECT pd.*, pr.Nombre AS NombreProducto
        FROM Pedido_Detalle pd
        JOIN Producto pr ON pr.Id = pd.ProductoID
        WHERE pd.PedidoID = @PedidoID
      `);

        res.json([{ pedido: pedido.recordset[0], detalles: detalles.recordset }]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const createPedido = async (req, res) => {
    const { UsuarioID, productos } = req.body;

    console.log("min: ", UsuarioID, "body: ", req.body)

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // 1. Insertar pedido
        const pedidoRequest = new sql.Request(transaction);
        const pedidoResult = await pedidoRequest
            .input('UsuarioID', sql.Int, UsuarioID)
            .query(`
                INSERT INTO Pedido (UsuarioID, Estado)
                OUTPUT INSERTED.Id
                VALUES (@UsuarioID, 'pendiente')
            `);

        const pedidoId = pedidoResult.recordset[0].Id;
        console.log('Pedido creado con ID:', pedidoId);

        // 2. Procesar cada producto
        for (const item of productos) {
            const productoId = parseInt(item.ProductoID);
            const cantidad = parseFloat(item.Cantidad);

            if (!productoId || isNaN(cantidad)) {
                throw new Error(`Datos inválidos en el producto: ${JSON.stringify(item)}`);
            }

            // 2.1 Insertar detalle del pedido
            const detalleRequest = new sql.Request(transaction);
            await detalleRequest
                .input('PedidoID', sql.Int, pedidoId)
                .input('ProductoID', sql.Int, productoId)
                .input('Cantidad', sql.Decimal(12, 2), cantidad)
                .query(`
                    INSERT INTO Pedido_Detalle (PedidoID, ProductoID, Cantidad)
                    VALUES (@PedidoID, @ProductoID, @Cantidad)
                `);

            // 2.2 Consultar insumos para este producto
            const insumoRequest = new sql.Request(transaction);
            const insumosResult = await insumoRequest
                .input('ProdID', sql.Int, productoId)
                .query(`
                    SELECT InsumoID, CantidadUsada
                    FROM Producto_Insumo
                    WHERE ProductoID = @ProdID
                `);

            // 2.3 Actualizar stock de insumos y registrar en logs
            for (const insumo of insumosResult.recordset) {
                const cantidadTotal = insumo.CantidadUsada * cantidad;

                // Actualizar stock
                const stockRequest = new sql.Request(transaction);
                await stockRequest
                    .input('InsumoID', sql.Int, insumo.InsumoID)
                    .input('Cantidad', sql.Decimal(12, 2), cantidadTotal)
                    .query(`
                        UPDATE Insumo
                        SET CantidadDisponible = CantidadDisponible - @Cantidad,
                            FechaActualizacion = GETDATE()
                        WHERE Id = @InsumoID
                    `);

                // Insertar log
                const logRequest = new sql.Request(transaction);
                await logRequest
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

        await transaction.commit();
        res.status(200).json({ success: true, pedidoId });

    } catch (error) {
        console.error('Error en creación de pedido:', error);
        await transaction.rollback();
        res.status(500).json({ success: false, error: error.message });
    }
};
