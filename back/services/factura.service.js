import { pool } from "../database/db.js";

export const updateFactura = async (id, data) => {
    const { metodo_pago, estado } = data;

    try {
        const query = `
      UPDATE factura
      SET metodo_pago = COALESCE($1, metodo_pago),
          estado = COALESCE($2, estado)
      WHERE id = $3
      RETURNING *;
    `;
        const result = await pool.query(query, [metodo_pago, estado, id]);

        if (result.rows.length === 0) {
            return { message: "Factura no encontrada" };
        }

        return result.rows[0];
    } catch (error) {
        console.error("❌ Error al actualizar factura:", error);
        return { message: "Error al actualizar factura" };
    }
};
