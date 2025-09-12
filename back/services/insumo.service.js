import { pool } from "../database/db.js";

export const getAllInsumos = async () => {
    try {
        const query = `SELECT * FROM Insumo`;
        console.log(`----> EJECUTANDO QUERY: ${query}`);
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getInsumoById = async (id) => {
    try {
        const query = `SELECT * FROM Insumo WHERE Id = $1`;
        console.log(`----> EJECUTANDO QUERY: ${query} con id=${id}`);
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createInsumo = async (data) => {
    const client = await pool.connect();
    try {
        const {
            Nombre,
            Proveedor,
            Cantidad_Unidad,
            Precio_Unidad,
            Compuesto,
            CantidadDisponible = 0,
            ingredientes = [],
        } = data;

        await client.query("BEGIN");

        const query1 = `
      INSERT INTO insumo (
        nombre, proveedor, cantidad_unidad,
        precio_unidad, compuesto, cantidaddisponible
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

        console.log(`----> EJECUTANDO QUERY: ${query1}`);

        const result = await client.query(query1, [
            Nombre,
            Proveedor,
            Cantidad_Unidad,
            Precio_Unidad,
            Compuesto,
            CantidadDisponible,
        ]);

        const nuevoId = result.rows[0].id;

        if (Compuesto && ingredientes.length > 0) {
            const query2 = `
        INSERT INTO insumo_composicion (insumocompuestoid, ingredienteid, cantidadporgramo)
        VALUES ($1, $2, $3)
      `;
            for (const ing of ingredientes) {
                await client.query(query2, [
                    nuevoId,
                    ing.insumoId,
                    ing.cantidadPorGramo,
                ]);
            }
        }

        await client.query("COMMIT");

        return { message: "Insumo creado correctamente", id: nuevoId };
    } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(error.message);
    } finally {
        client.release();
    }
};

export const updateInsumo = () => {
    // pendiente implementar
};
