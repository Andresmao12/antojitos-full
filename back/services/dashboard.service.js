import { pool } from "../database/db.js";

export const getDashboardData = async () => {
  try {
    console.log("Ejecutando query A...");
    const estados = await pool.query(`
      SELECT estado, COUNT(*) AS total
      FROM pedido
      GROUP BY estado
    `);

    console.log("Ejecutando query B...");
    const postresPendientes = await pool.query(`
      SELECT pr.nombre, pr.tamanio_id AS tamanioid, SUM(pd.cantidad) AS cantidadtotal
      FROM pedido p
      JOIN pedido_detalle pd ON p.id = pd.pedido_id
      JOIN producto pr ON pr.id = pd.producto_id
      WHERE p.estado = 'PENDIENTE'
      GROUP BY pr.nombre, pr.tamanio_id
    `);

    console.log("Ejecutando query C...");
    const ingresos = await pool.query(`
      SELECT SUM(total) AS totalingresos FROM factura
    `);

    console.log("Ejecutando query D...");
    const egresos = await pool.query(`
      SELECT SUM(li.cantidad * COALESCE(i.precio_gramo, 0)) AS totalegresos
      FROM log_insumo li
      JOIN insumo i ON li.insumo_id = i.id
      WHERE li.tipo_movimiento = 'SALIDA'
    `);

    console.log("Ejecutando query E...");
    const insumosPendientesResult = await pool.query(`
      SELECT pi.insumo_id AS insumoid, SUM(pd.cantidad * pi.cantidad) AS cantidadtotal
      FROM pedido p
      JOIN pedido_detalle pd ON p.id = pd.pedido_id
      JOIN producto_insumo pi ON pd.producto_id = pi.producto_id
      WHERE p.estado = 'PENDIENTE'
      GROUP BY pi.insumo_id
    `);
    const insumosPendientes = insumosPendientesResult.rows;

    console.log("Consultando insumos compuestos...");
    const insumosCompuestosResult = await pool.query(`
      SELECT id FROM insumo WHERE compuesto = true
    `);
    const idsCompuestos = insumosCompuestosResult.rows.map(row => row.id);

    console.log("Consultando composiciones...");
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

    console.log("Enviando respuesta del dashboard...");

    return {
      pedidosPorEstado: estados.rows,
      postresPendientes: postresPendientes.rows,
      ingresos: ingresos.rows[0]?.totalingresos || 0,
      egresos: egresos.rows[0]?.totalegresos || 0,
      insumosRequeridos: insumosRequeridosFinal,
    };

  } catch (error) {
    console.error("Error en el endpoint de dashboard:", error);
    return {
      error: "Error interno al cargar el dashboard",
      detalle: error.message
    };
  }
};
