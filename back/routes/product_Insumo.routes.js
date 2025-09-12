import { Router } from 'express';
import { getAll, getPostreInsumoById } from '../controllers/Product_insumo.controller.js';

const productoInsumoRouter = Router();

productoInsumoRouter.get('/', getAll);
productoInsumoRouter.get('/:id', getPostreInsumoById);
// productoInsumoRouter.post('/', createPostre);
// productoInsumoRouter.put('/', updatePostre);

export default productoInsumoRouter;