import { Router } from 'express';
import { getAll, getPostreById } from '../controllers/pedido.controller.js';

const PedidoRouter = Router();

PedidoRouter.get('/', getAll);
// router.get('/:id', getPostreById);
// router.post('/', createPostre);
// router.put('/', updatePostre);

export default PedidoRouter;