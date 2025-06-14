import { Router } from 'express';
import { getAll, createPostre, getPostreById } from '../controllers/product.controller.js';

const ProductRouter = Router();

ProductRouter.get('/', getAll);
ProductRouter.get('/:id', getPostreById);
ProductRouter.post('/', createPostre);
// ProductRouter.put('/', updatePostre);

export default ProductRouter;