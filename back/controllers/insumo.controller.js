import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Insumo');
        console.log(result.recordset)
        res.json(result.recordset);



    } catch (error) {
        console.error('-- Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuaarios' });
    }

};

export const getUserById = (req, res) => {
    const { id } = req.params;
    res.json({ name: `Insumo ${id}` });
};

export const createInsumo = async (req, res) => {
    const { Nombre, Proveedor, Presentacion, CantidadPorPresentacion, PrecioPresentacion, CantidadDisponible } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('Proveedor', sql.VarChar, Proveedor)
            .input('Presentacion', sql.VarChar, Presentacion)
            .input('CantidadPorPresentacion', sql.Decimal(10, 2), CantidadPorPresentacion)
            .input('PrecioPresentacion', sql.Decimal(10, 2), PrecioPresentacion)
            .input('CantidadDisponible', sql.Decimal(12, 2), CantidadDisponible)
            .query(`
            INSERT INTO Insumo (
                Nombre,
                Proveedor,
                Presentacion,
                CantidadPorPresentacion,
                PrecioPresentacion,
                CantidadDisponible
            ) VALUES (
                @Nombre,
                @Proveedor,
                @Presentacion,
                @CantidadPorPresentacion,
                @PrecioPresentacion,
                @CantidadDisponible
            )
        `);

        console.log(result);
        res.status(201).json({ message: 'Producto creado exitosamente' });

        ;
    } catch (error) {
        console.error('-- Error al crear Producto:', error);
        res.status(500).json({ error: 'Error al crear el Producto' });
    }
};

export const updateUser = (req, res) => {
    const nuevoUser = req.body;
    res.status(201).json({ message: "User creado", data: nuevoUser });
};

