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
    const insumosPendientesResult = await pool.request().query(`
    SELECT pi.InsumoID, SUM(pd.Cantidad * pi.CantidadUsada) AS CantidadTotal
    FROM Pedido p
    JOIN Pedido_Detalle pd ON p.Id = pd.PedidoID
    JOIN Producto_Insumo pi ON pd.ProductoID = pi.ProductoID
    WHERE p.Estado = 'pendiente'
    GROUP BY pi.InsumoID
`);
    const insumosPendientes = insumosPendientesResult.recordset;

    // Obtener los insumos compuestos
    console.log("🔍 Consultando insumos compuestos...");
    const insumosCompuestosResult = await pool.request().query(`
    SELECT Id FROM Insumo WHERE Compuesto = 1
`);
    const idsCompuestos = insumosCompuestosResult.recordset.map(row => row.Id);

    // Obtener composiciones
    console.log("🔍 Consultando composiciones...");
    const composicionesResult = await pool.request().query(`
    SELECT * FROM Insumo_Composicion
`);
    const composiciones = composicionesResult.recordset;

    // Expansión de insumos compuestos
    let insumosExpandidos = [];

    for (const insumo of insumosPendientes) {
      const { InsumoID, CantidadTotal } = insumo;

      if (idsCompuestos.includes(InsumoID)) {
        const componentes = composiciones.filter(c => c.InsumoCompuestoID === InsumoID);
        for (const comp of componentes) {
          insumosExpandidos.push({
            InsumoID: comp.IngredienteID,
            CantidadTotal: CantidadTotal * comp.CantidadPorGramo
          });
        }
      } else {
        insumosExpandidos.push(insumo); // dejar tal cual los simples
      }
    }

    // Agrupar por InsumoID
    const insumosRequeridosFinal = insumosExpandidos.reduce((acc, curr) => {
      const existente = acc.find(i => i.InsumoID === curr.InsumoID);
      if (existente) {
        existente.CantidadTotal += curr.CantidadTotal;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);

    console.log("📊 Enviando respuesta del dashboard...");

    res.json({
      pedidosPorEstado: estados.recordset,
      postresPendientes: postresPendientes.recordset,
      ingresos: ingresos.recordset[0]?.TotalIngresos || 0,
      egresos: egresos.recordset[0]?.TotalEgresos || 0,
      insumosRequeridos: insumosRequeridosFinal,
    });

  } catch (error) {
    console.error("💥 Error en el endpoint de dashboard:", error);
    res.status(500).json({
      error: "Error interno al cargar el dashboard",
      detalle: error.message
    });
  }
};
