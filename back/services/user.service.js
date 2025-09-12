import { pool } from "../database/db.js";

export const getAllUsers = async () => {
    try {
        const query = 'SELECT * FROM usuario';
        console.log(`----> EJECUTANDO QUERY: ${query}`);

        const result = await pool.query(query);
        return result.rows;

    } catch (error) {
        throw new Error(error.message);
    }
};

export const getUserById = async (id) => {
    try {
        const query = 'SELECT * FROM usuario WHERE id = $1';
        console.log(`----> EJECUTANDO QUERY: ${query}`);

        const result = await pool.query(query, [id]);
        return result.rows[0];

    } catch (error) {
        throw new Error(error.message);
    }
};

export const createUser = async (data) => {
    const { Nombre, Correo, RolID, Celular, Direccion } = data;

    try {
        const query = `
      INSERT INTO usuario (nombre, correo, rolid, celular, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
        console.log(`----> EJECUTANDO QUERY: ${query}`);

        const result = await pool.query(query, [
            Nombre, Correo, RolID || 1, Celular, Direccion
        ]);

        return { message: 'Usuario creado exitosamente', id: result.rows[0].id };

    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateUser = async (id, data) => {
    const { Nombre, Correo, RolID, Celular, Direccion, Estado } = data;

    try {
        const query = `
      UPDATE usuario
      SET nombre = $1, correo = $2, rolid = $3, celular = $4, direccion = $5, estado = $6
      WHERE id = $7
      RETURNING *
    `;
        console.log(`----> EJECUTANDO QUERY: ${query}`);

        const result = await pool.query(query, [
            Nombre, Correo, RolID, Celular, Direccion, Estado, id
        ]);

        return { message: 'Usuario actualizado correctamente', data: result.rows[0] };

    } catch (error) {
        throw new Error(error.message);
    }
};
