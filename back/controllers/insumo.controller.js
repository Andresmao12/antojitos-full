import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Insumo');
        console.log(result.recordset)
        res.json(result.recordset);

        pool.close()

    } catch (error) {
        console.error('-- Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuaarios' });
    }

};

export const getUserById = (req, res) => {
    const { id } = req.params;
    res.json({ name: `Insumo ${id}` });
};

export const createUser = async (req, res) => {
    const { Nombre, Correo, Rol, Celular, Direccion } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('Correo', sql.VarChar, Correo)
            .input('Rol', sql.VarChar, Rol)
            .input('Celular', sql.VarChar, Celular)
            .input('Direccion', sql.VarChar, Direccion)
            .query(`
                INSERT INTO Insumo (Nombre, Correo, Rol, Celular, Direccion)
                VALUES (@Nombre, @Correo, @Rol, @Celular, @Direccion)
            `);

        console.log(result);
        res.status(201).json({ message: 'Usuario creado exitosamente' });

        pool.close();
    } catch (error) {
        console.error('-- Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

export const updateUser = (req, res) => {
    const nuevoUser = req.body;
    res.status(201).json({ message: "User creado", data: nuevoUser });
};

