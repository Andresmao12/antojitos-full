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
    const {
        Nombre,
        Proveedor,
        Presentacion,
        CantidadPorPresentacion,
        PrecioPresentacion,
        Compuesto,
        CantidadDisponible = 0,
        ingredientes = [],
    } = req.body;

    const pool = await sql.connect(config);
    
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input("Nombre", sql.NVarChar(100), Nombre);
        request.input("Proveedor", sql.NVarChar(100), Proveedor);
        request.input("Presentacion", sql.NVarChar(50), Presentacion);
        request.input("CantidadPorPresentacion", sql.Decimal(10, 2), CantidadPorPresentacion);
        request.input("PrecioPresentacion", sql.Decimal(10, 2), PrecioPresentacion);
        request.input("Compuesto", sql.Bit, Compuesto);
        request.input("CantidadDisponible", sql.Decimal(12, 2), CantidadDisponible);

        const result = await request.query(`
      INSERT INTO Insumo (
        Nombre, Proveedor, Presentacion, CantidadPorPresentacion,
        PrecioPresentacion, Compuesto, CantidadDisponible
      ) 
      OUTPUT INSERTED.Id AS nuevoId
      VALUES (@Nombre, @Proveedor, @Presentacion, @CantidadPorPresentacion, @PrecioPresentacion, @Compuesto, @CantidadDisponible)
    `);

        const nuevoId = result.recordset[0].nuevoId;

        if (Compuesto && ingredientes.length > 0) {
            for (const ing of ingredientes) {
                await transaction.request()
                    .input("InsumoCompuestoID", sql.Int, nuevoId)
                    .input("IngredienteID", sql.Int, ing.insumoId)
                    .input("CantidadPorGramo", sql.Decimal(10, 4), ing.cantidadPorGramo)
                    .query(`
            INSERT INTO Insumo_Composicion (InsumoCompuestoID, IngredienteID, CantidadPorGramo)
            VALUES (@InsumoCompuestoID, @IngredienteID, @CantidadPorGramo)
          `);
            }
        }

        await transaction.commit();
        res.status(201).json({ message: "Insumo creado correctamente", id: nuevoId });
    } catch (err) {
        await transaction.rollback();
        console.error("Error creando insumo:", err);
        res.status(500).json({ error: "Error creando insumo" });
    }
};

export const updateUser = (req, res) => {
    const nuevoUser = req.body;
    res.status(201).json({ message: "User creado", data: nuevoUser });
};

