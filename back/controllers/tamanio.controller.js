import * as tamanioService from '../services/tamanio.service.js';

export const getAllTamanio = async (req, res) => {
    try {
        const result = await tamanioService.getAllTamanio()
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};
