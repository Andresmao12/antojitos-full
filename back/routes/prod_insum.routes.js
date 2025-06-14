import { Router } from 'express';
import { getAll, getPostreInsumoById } from '../controllers/Prod_insum.controller.js';

const Prod_insumRouter = Router();

Prod_insumRouter.get('/', getAll);
Prod_insumRouter.get('/:id', getPostreInsumoById);
// Prod_insumRouter.post('/', createPostre);
// ProductRouter.put('/', updatePostre);

export default Prod_insumRouter;