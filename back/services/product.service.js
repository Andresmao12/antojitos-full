import { pool } from "../database/db.js";

export const getAllProducts = async () => {
    try {
        const query = 'SELECT * FROM producto';
        console.log(`----> EJECUTANDO QUERY: "${query}"`);

        const result = await pool.query(query);
        return result.rows;

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        return { error: 'Error al obtener los productos' };
    }
};

export const getProductById = async (id) => {
    try {
        if (!id) return { error: 'ID no proporcionado' };

        const query = 'SELECT * FROM producto WHERE id = $1';
        console.log(`----> EJECUTANDO QUERY: "${query}"`);

        const result = await pool.query(query, [id]);
        return result.rows;

    } catch (error) {
        console.error('-- Error al obtener producto:', error);
        return { error: 'Error al obtener el producto' };
    }
};

export const createProduct = async (data) => {
    const {
        nombre,
        url_imagen,
        descripcion,
        tamanio_id,
        datos_proceso,
        precio_venta,
        plantilla_id = null,
        insumos = []
    } = data;

    console.log("DATA RECIBIDA EN SERVICE: ", data);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const queryProducto = `
            INSERT INTO producto (nombre, url_imagen, descripcion, precio_venta, datos_proceso, tamanio_id, plantilla_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        console.log(`----> EJECUTANDO QUERY Producto: "${queryProducto}"`);

        const resultProd = await client.query(queryProducto, [
            nombre, url_imagen, descripcion, precio_venta, datos_proceso, tamanio_id,  plantilla_id
        ]);

        const productoId = resultProd.rows[0].id;

        if (insumos.length > 0) {
            const queryInsumo = `
                INSERT INTO producto_insumo (insumo_id, producto_id, cantidad, precio_unitario)
                VALUES ($1, $2, $3, $4)
            `;
            console.log(`----> EJECUTANDO QUERY Insumos: "${queryInsumo}"`);

            for (const insumo of insumos) {
                await client.query(queryInsumo, [
                    insumo.insumoId,
                    productoId,
                    insumo.cantidad,
                    insumo.precioUnitario || 0
                ]);
            }
        }

        await client.query('COMMIT');
        return { message: 'Producto creado exitosamente', id: productoId };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('-- Error al crear producto:', error);
        return { error: 'Error al crear el producto' };
    } finally {
        client.release();
    }
};

export const updateProduct = async (id, data) => {
    const { Nombre, UrlImagen, Descripcion, TamanioID, DatosProceso, PrecioVenta, PlantillaID } = data;

    try {
        const query = `
      UPDATE producto
      SET nombre = $1, urlimagen = $2, descripcion = $3, precioVenta = $4, datosProceso = $5, tamanioid = $6, plantillaid = $7
      WHERE id = $8
      RETURNING *
    `;
        console.log(`----> EJECUTANDO QUERY Update Producto: "${query}"`);

        const result = await pool.query(query, [
            Nombre, UrlImagen, Descripcion, PrecioVenta, DatosProceso, TamanioID, PlantillaID, id
        ]);

        return { message: "Producto actualizado correctamente", data: result.rows[0] };

    } catch (error) {
        console.error('-- Error al actualizar producto:', error);
        return { error: 'Error al actualizar el producto' };
    }
};
