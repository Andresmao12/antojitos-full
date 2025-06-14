import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Producto');
        console.log(result.recordset)
        res.json(result.recordset);

        pool.close()

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }

};

export const getPostreById = async (req, res) => {
    try {

        if ((!req.params.id)) return res.status(400).json({ error: 'ID no proporcionado' });
        const id = req.params.id;

        const pool = await sql.connect(config);
        const result = await pool.request().input('id', id).query('SELECT * FROM Producto AS p WHERE p.Id = @id');
        console.log(result.recordset)
        res.json(result.recordset);

        pool.close()

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const createPostre = async (req, res) => {
    const { Nombre, UrlImagen, Descripcion, DatosProceso, PrecioVenta, insumos } = req.body;

    console.log("DATOS PROCESOOOOO: ----->"  , JSON.stringify(DatosProceso))

    try {
        const pool = await sql.connect(config);

        const resultprod = await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('UrlImagen', sql.VarChar, UrlImagen)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('PrecioVenta', sql.Decimal, PrecioVenta)
            .input('DatosProceso', sql.VarChar, DatosProceso)
            .query(`
                INSERT INTO Producto (Nombre, UrlImagen, Descripcion, PrecioVenta, DatosProceso)
                VALUES (@Nombre, @UrlImagen, @Descripcion, @PrecioVenta, @DatosProceso);
                SELECT SCOPE_IDENTITY() AS NewId
            `);

        const idGenerado = resultprod.recordset[0].NewId
        console.log("-----> RESULTADO DEL ID GENERADO: ", idGenerado);

        console.log("PRODUCTO -> INSUMO DIRECTO: ", insumos)

        for (const [i, register] of insumos.entries()) {

            console.log("PRODUCTO -> INSUMO: ", register)
            const result = await pool.request()
                .input('insumoId', sql.VarChar, register['insumoId'],)
                .input('productoId', sql.VarChar, idGenerado.toString())
                .input('cantidad', sql.VarChar, register['cantidad'])
                .query(`
                INSERT INTO Producto_Insumo (InsumoID, ProductoID, CantidadUsada)
                VALUES (@insumoId, @productoId, @cantidad)
            `);

            console.log(`[${i}] insumos ---->  ${result}`)

        }

        res.status(201).json({ message: 'Producto creado exitosamente' });

        pool.close();

    } catch (error) {
        console.error('-- Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updatePostre = (req, res) => {
    const nuevoPostre = req.body;
    res.status(201).json({ message: "Postre creado", data: nuevoPostre });
};