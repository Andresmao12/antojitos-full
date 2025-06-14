import { sql, config } from "../database/db.js";

export const getAll = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Pedido');
        console.log(result.recordset)
        res.json(result.recordset);
        
        pool.close()

    } catch (error) {
        console.error('-- Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};

export const getPostreById = (req, res) => {
    const { id } = req.params;
    res.json({ name: `Postre ${id}` });
};

export const createPostre = (req, res) => {
    const nuevoPostre = req.body;
    res.status(201).json({ message: "Postre creado", data: nuevoPostre });
};

export const updatePostre = (req, res) => {
    const nuevoPostre = req.body;
    res.status(201).json({ message: "Postre creado", data: nuevoPostre });
};