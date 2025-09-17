import * as orderService from '../services/order.service.js';

export const getAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAllOrders();
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const result = await orderService.getOrderById(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};

export const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.body);
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};


export const updateOrderState = async (req, res) => {
    try {
        const result = await orderService.updateOrderState(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        console.error('-- Error al obtener un product:', error);
        res.status(500).json({ error: 'Error al obtener un product' });
    }
};