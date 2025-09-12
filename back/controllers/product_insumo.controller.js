import * as productService from '../services/product_insumo.service.js';

export const getAll = async (req, res) => {
    try {
        const result = await productService.getAllProduct_Insumo();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getPostreInsumoById = async (req, res) => {
    try {
        const result = await productService.getProduct_InsumoById();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const createUser = async (req, res) => {
    try {
        const result = await productService.createProduct_Insumo();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const result = await productService.updateProduct_Insumo();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

