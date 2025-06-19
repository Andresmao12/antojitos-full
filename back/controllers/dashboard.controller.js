import { sql, config } from "../database/db.js";

export const getDashboardData = async (req, res) => {
  try {
    const pool = await sql.connect(config);

    console.log("🔍 Ejecutando query A...");
    const estados = await pool.request().query(`
            SELECT Estado, COUNT(*) AS Total 
            FROM Pedido 
            GROUP BY Estado
        `);

    console.log("🔍 Ejecutando query B...");
    const postresPendientes = await pool.request().query(`
            SELECT pr.Nombre, pr.Tamanio, SUM(pd.Cantidad) AS CantidadTotal
            FROM Pedido p
            JOIN Pedido_Detalle pd ON p.Id = pd.PedidoID
            JOIN Producto pr ON pr.Id = pd.ProductoID
            WHERE p.Estado = 'pendiente'
            GROUP BY pr.Nombre, pr.Tamanio
        `);

    console.log("🔍 Ejecutando query C...");
    const ingresos = await pool.request().query(`
            SELECT SUM(Total) AS TotalIngresos FROM Factura
        `);

    console.log("🔍 Ejecutando query D...");
    const egresos = await pool.request().query(`
            SELECT SUM(li.Cantidad * i.PrecioUnitarioCalculado) AS TotalEgresos
            FROM Log_Insumo li
            JOIN Insumo i ON li.InsumoID = i.Id
            WHERE li.TipoMovimiento = 'salida'
        `);

    console.log("🔍 Ejecutando query E...");
    const insumosPendientes = await pool.request().query(`
            SELECT pi.InsumoID, SUM(pd.Cantidad * pi.CantidadUsada) AS CantidadTotal
            FROM Pedido p
            JOIN Pedido_Detalle pd ON p.Id = pd.PedidoID
            JOIN Producto_Insumo pi ON pd.ProductoID = pi.ProductoID
            WHERE p.Estado = 'pendiente'
            GROUP BY pi.InsumoID
        `);

    console.log("📊 Enviando respuesta del dashboard...");

    res.json({
      pedidosPorEstado: estados.recordset,
      postresPendientes: postresPendientes.recordset,
      ingresos: ingresos.recordset[0]?.TotalIngresos || 0,
      egresos: egresos.recordset[0]?.TotalEgresos || 0,
      insumosRequeridos: insumosPendientes.recordset,
    });

  } catch (error) {
    console.error("💥 Error en el endpoint de dashboard:", error);
    res.status(500).json({
      error: "Error interno al cargar el dashboard",
      detalle: error.message
    });
  }
};
