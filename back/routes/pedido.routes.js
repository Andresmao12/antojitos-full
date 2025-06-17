import { Router } from 'express';
import { getAll, getPedidoById, createPedido } from '../controllers/pedido.controller.js';

const PedidoRouter = Router();

PedidoRouter.get('/', getAll);
PedidoRouter.get('/:id', getPedidoById);
PedidoRouter.post('/', createPedido);
// router.put('/', updatePostre);

export default PedidoRouter;