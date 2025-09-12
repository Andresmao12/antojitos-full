import { Router } from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrderState } from '../controllers/order.controller.js';

const pedidoRouter = Router();

pedidoRouter.get('/', getAllOrders);
pedidoRouter.get('/:id', getOrderById);
pedidoRouter.post('/', createOrder);
pedidoRouter.put('/:id', updateOrderState);

export default pedidoRouter;