import * as insumoService from '../services/insumo.service.js';

export const getAllInsumos = async (req, res) => {

    try {
        const result = await insumoService.getAllInsumos();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los insumos:', error);
        res.status(500).json({ error: 'Error al obtener los insumos', detalle: error.message });
    }
};


export const getInsumoById = async (req, res) => {
    try {
        const result = await insumoService.getInsumoById(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un insumo:', error);
        res.status(500).json({ error: 'Error al obtener un insumo' });
    }
};

export const createInsumo = async (req, res) => {
    try {
        const result = await insumoService.createInsumo(req.body);
        res.json(result);
    } catch (error) {
        console.error('-- Error crear un insumo:', error);
        res.status(500).json({ error: 'Error al crear un insumo' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const result = await insumoService.updateInsumo();
        res.json(result);
    } catch (error) {
        console.error('-- Error al actualizar un insumo:', error);
        res.status(500).json({ error: 'Error al actualizar un insumo' });
    }
};

