import { Router } from 'express';
import { getAllInsumos, getInsumoById, createInsumo } from '../controllers/insumo.controller.js';

const insumoRouter = Router();

insumoRouter.get('/', getAllInsumos);
insumoRouter.get('/:id', getInsumoById);
insumoRouter.post('/', createInsumo);
// insumoRouter.put('/', updatePostre);

export default insumoRouter;