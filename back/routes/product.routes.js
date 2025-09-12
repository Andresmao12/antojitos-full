import { Router } from 'express';
import { getAllProducts, createProduct, getProductById, updateProduct } from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', createProduct);
// productRouter.put('/', updateProduct);

export default productRouter;