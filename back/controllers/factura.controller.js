import * as facturaService from '../services/factura.service.js';


export const updateFacturaState = async (req, res) => {
    try {
        const result = await facturaService.updateFactura(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};