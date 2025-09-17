import { pool } from "../database/db.js";

// 📌 Obtener todos
export const getAllProduct_Insumo = async () => {
    try {
        const query = `
      SELECT pi.*, p.Nombre AS Producto, i.Nombre AS Insumo
      FROM producto_insumo pi
      JOIN producto p ON pi.producto_id = p.id
      JOIN insumo i ON pi.insumo_id = i.id
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('-- Error al obtener producto_insumo:', error);
        return { error: 'Error al obtener producto_insumo' };
    }
};

// 📌 Obtener por ID
export const getProduct_InsumoById = async (id) => {
    try {
        if (!id) return { error: 'ID no proporcionado' };

        const query = `
      SELECT pi.*, p.Nombre AS Producto, i.Nombre AS Insumo
      FROM producto_insumo pi
      JOIN producto p ON pi.productoid = p.id
      JOIN insumo i ON pi.insumoid = i.id
      WHERE pi.id = $1
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (error) {
        console.error('-- Error al obtener producto_insumo:', error);
        return { error: 'Error al obtener producto_insumo' };
    }
};

// 📌 Crear
export const createProduct_Insumo = async (data) => {
    const { productoid, insumoid, cantidad, preciounitario } = data;

    try {
        const query = `
      INSERT INTO producto_insumo (productoid, insumoid, cantidad, preciounitario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query, [productoid, insumoid, cantidad, preciounitario]);
        return { message: 'Producto_Insumo creado exitosamente', data: result.rows[0] };
    } catch (error) {
        console.error('-- Error al crear producto_insumo:', error);
        return { error: 'Error al crear producto_insumo' };
    }
};

// 📌 Actualizar
export const updateProduct_Insumo = async (id, data) => {
    const { productoid, insumoid, cantidad, preciounitario } = data;

    try {
        const query = `
      UPDATE producto_insumo
      SET productoid = $1, insumoid = $2, cantidad = $3, preciounitario = $4
      WHERE id = $5
      RETURNING *
    `;
        console.log(`----> EJECUTANDO QUERY... "${query}"`);

        const result = await pool.query(query, [productoid, insumoid, cantidad, preciounitario, id]);
        return { message: "Producto_Insumo actualizado correctamente", data: result.rows[0] };
    } catch (error) {
        console.error('-- Error al actualizar producto_insumo:', error);
        return { error: 'Error al actualizar producto_insumo' };
    }
};
