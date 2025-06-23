import { Router } from 'express';
import { getAll, getPedidoById, createPedido, updateEstadoPedido } from '../controllers/pedido.controller.js';

const PedidoRouter = Router();

PedidoRouter.get('/', getAll);
PedidoRouter.get('/:id', getPedidoById);
PedidoRouter.post('/', createPedido);
PedidoRouter.put('/:id', updateEstadoPedido);

export default PedidoRouter;