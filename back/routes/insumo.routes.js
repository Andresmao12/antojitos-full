import { Router } from 'express';
import { getAll } from '../controllers/insumo.controller.js';

const InsumoRouter = Router();

InsumoRouter.get('/', getAll);
// router.get('/:id', getPostreById);
// router.post('/', createPostre);
// router.put('/', updatePostre);

export default InsumoRouter;