import { pool } from "../database/db.js";

export const getAllTamanio = async () => {
    try {
        const query = `SELECT * FROM tamanio`;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('-- Error al obtener tamanios:', error);
        return { error: 'Error al obtener los tamanios' };
    }
};