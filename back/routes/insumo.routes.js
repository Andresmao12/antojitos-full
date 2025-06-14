import { Router } from 'express';
import { getAll, createInsumo } from '../controllers/insumo.controller.js';

const InsumoRouter = Router();

InsumoRouter.get('/', getAll);
// router.get('/:id', getPostreById);
InsumoRouter.post('/', createInsumo);
// router.put('/', updatePostre);

export default InsumoRouter;