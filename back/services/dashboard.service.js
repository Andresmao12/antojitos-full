import { pool } from "../database/db.js";

export const getDashboardData = async () => {
  try {
    // A. Pedidos por estado
    const estados = await pool.query(`
      SELECT estado, COUNT(*) AS total
      FROM pedido
      GROUP BY estado
    `);

    // B. Postres pendientes (por nombre y tamaño)
    const postresPendientes = await pool.query(`
      SELECT pr.nombre, pr.tamanio_id AS tamanioid, SUM(pd.cantidad) AS cantidadtotal
      FROM pedido p
      JOIN pedido_detalle pd ON p.id = pd.pedido_id
      JOIN producto pr ON pr.id = pd.producto_id
      WHERE p.estado = 'PENDIENTE'
      GROUP BY pr.nombre, pr.tamanio_id
    `);

    // C. Ingresos
    const ingresos = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS totalingresos 
      FROM factura
    `);

    // D. Egresos
    const egresos = await pool.query(`
      SELECT COALESCE(SUM(li.cantidad * COALESCE(i.precio_gramo, 0)), 0) AS totalegresos
      FROM log_insumo li
      JOIN insumo i ON li.insumo_id = i.id
      WHERE li.tipo_movimiento = 'SALIDA'
    `);

    // E. Insumos requeridos (pendientes)
    const insumosPendientesResult = await pool.query(`
      SELECT pi.insumo_id AS insumoid, SUM(pd.cantidad * pi.cantidad) AS cantidadtotal
      FROM pedido p
      JOIN pedido_detalle pd ON p.id = pd.pedido_id
      JOIN producto_insumo pi ON pd.producto_id = pi.producto_id
      WHERE p.estado = 'PENDIENTE'
      GROUP BY pi.insumo_id
    `);
    const insumosPendientes = insumosPendientesResult.rows;

    // E1. Expandir insumos compuestos
    const insumosCompuestosResult = await pool.query(`SELECT id FROM insumo WHERE compuesto = true`);
    const idsCompuestos = insumosCompuestosResult.rows.map(row => row.id);

    const composicionesResult = await pool.query(`
      SELECT 
        insumo_compuesto_id AS insumocompuestoid, 
        ingrediente_id AS ingredienteid, 
        cantidad_por_gramo AS cantidadporgramo
      FROM insumo_composicion
    `);
    const composiciones = composicionesResult.rows;

    let insumosExpandidos = [];
    for (const insumo of insumosPendientes) {
      const { insumoid, cantidadtotal } = insumo;
      if (idsCompuestos.includes(insumoid)) {
        const componentes = composiciones.filter(c => c.insumocompuestoid === insumoid);
        for (const comp of componentes) {
          insumosExpandidos.push({
            insumoid: comp.ingredienteid,
            cantidadtotal: cantidadtotal * comp.cantidadporgramo
          });
        }
      } else {
        insumosExpandidos.push(insumo);
      }
    }

    const insumosRequeridosFinal = insumosExpandidos.reduce((acc, curr) => {
      const existente = acc.find(i => i.insumoid === curr.insumoid);
      if (existente) {
        existente.cantidadtotal += curr.cantidadtotal;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);

    // F. Top postres más vendidos
    const topPostres = await pool.query(`
      SELECT pr.nombre, COUNT(*) AS total_vendidos
      FROM pedido_detalle pd
      JOIN producto pr ON pr.id = pd.producto_id
      GROUP BY pr.nombre
      ORDER BY total_vendidos DESC
      LIMIT 5
    `);

    // G. Ventas por día (últimos 30 días)
    const ventasPorDia = await pool.query(`
      SELECT DATE(f.fecha) AS dia, SUM(f.total) AS total_dia
      FROM factura f
      WHERE f.fecha >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(f.fecha)
      ORDER BY dia ASC
    `);

    // H. Calcular utilidad
    const utilidad = (Number(ingresos.rows[0]?.totalingresos) || 0) - (Number(egresos.rows[0]?.totalegresos) || 0);

    // I. Alertas básicas
    const alertas = [];
    if (utilidad < 0) {
      alertas.push({ tipo: "flujo_caja", mensaje: "⚠️ Los egresos superan a los ingresos en el periodo." });
    }
    if (insumosRequeridosFinal.length > 0) {
      alertas.push({ tipo: "produccion", mensaje: "📦 Hay insumos requeridos pendientes de compra." });
    }

    return {
      pedidosPorEstado: estados.rows,
      postresPendientes: postresPendientes.rows,
      ingresos: ingresos.rows[0]?.totalingresos || 0,
      egresos: egresos.rows[0]?.totalegresos || 0,
      utilidad,
      insumosRequeridos: insumosRequeridosFinal,
      topPostres: topPostres.rows,
      ventasPorDia: ventasPorDia.rows,
      alertas
    };

  } catch (error) {
    console.error("Error en el endpoint de dashboard:", error);
    return {
      error: "Error interno al cargar el dashboard",
      detalle: error.message
    };
  }
};
