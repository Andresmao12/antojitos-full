import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const query = 'SELECT * FROM Producto'
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pool = await sql.connect(config);
        const result = await pool.request().query(query);
        console.log(result.recordset)
        res.json(result.recordset);

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }

};

export const getPostreById = async (req, res) => {
    try {

        if ((!req.params.id)) return res.status(400).json({ error: 'ID no proporcionado' });
        const id = req.params.id;

        const query = 'SELECT * FROM Producto AS p WHERE p.Id = @id'
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pool = await sql.connect(config);
        const result = await pool.request().input('id', id).query(query);
        console.log("RECORSET? -----> ", result.recordset)
        res.json(result.recordset);

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const createPostre = async (req, res) => {
    const { Nombre, UrlImagen, Descripcion, Tamanio, DatosProceso, PrecioVenta, insumos } = req.body;

    try {


        const query = `INSERT INTO Producto (Nombre, UrlImagen, Descripcion, PrecioVenta, DatosProceso, Tamanio)
                VALUES (@Nombre, @UrlImagen, @Descripcion, @PrecioVenta, @DatosProceso, @Tamanio);
                SELECT SCOPE_IDENTITY() AS NewId`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        const pool = await sql.connect(config);

        const resultprod = await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('UrlImagen', sql.VarChar, UrlImagen)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('Tamanio', sql.VarChar, Tamanio)
            .input('PrecioVenta', sql.Decimal, PrecioVenta)
            .input('DatosProceso', sql.VarChar, DatosProceso)
            .query(`
                INSERT INTO Producto (Nombre, UrlImagen, Descripcion, PrecioVenta, DatosProceso, Tamanio)
                VALUES (@Nombre, @UrlImagen, @Descripcion, @PrecioVenta, @DatosProceso, @Tamanio);
                SELECT SCOPE_IDENTITY() AS NewId
            `);

        const idGenerado = resultprod.recordset[0].NewId


        const query2 = ` INSERT INTO Producto_Insumo (InsumoID, ProductoID, CantidadUsada)
                VALUES (@insumoId, @productoId, @cantidad)`
        console.log(`----> EJECUTANDO QUERY... "${query}"`)

        for (const [i, register] of insumos.entries()) {

            const result = await pool.request()
                .input('insumoId', sql.VarChar, register['insumoId'],)
                .input('productoId', sql.VarChar, idGenerado.toString())
                .input('cantidad', sql.VarChar, register['cantidad'])
                .query(query2);

            console.log(`[${i}] insumos ---->  ${result}`)

        }

        res.status(201).json({ message: 'Producto creado exitosamente' });

        ;

    } catch (error) {
        console.error('-- Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updatePostre = (req, res) => {
    const nuevoPostre = req.body;
    res.status(201).json({ message: "Postre creado", data: nuevoPostre });
};