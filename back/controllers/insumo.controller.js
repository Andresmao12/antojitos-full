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
    const { Nombre, Unidad, CantidadDisponible, PrecioUnitario } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('Unidad', sql.VarChar, Unidad)
            .input('CantidadDisponible', sql.Numeric, CantidadDisponible)
            .input('PrecioUnitario', sql.Decimal, PrecioUnitario)
            .query(`
                INSERT INTO Insumo (Nombre, Unidad, CantidadDisponible, PrecioUnitario)
                VALUES (@Nombre, @Unidad, @CantidadDisponible, @PrecioUnitario)
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

