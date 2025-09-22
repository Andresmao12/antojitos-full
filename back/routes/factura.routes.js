import { Router } from 'express';
import { updateFacturaState } from '../controllers/factura.controller.js';

const facturaRouter = Router();

// facturaRouter.get('/', getAllOrders);
// facturaRouter.get('/:id', getOrderById);
// facturaRouter.post('/', createOrder);
facturaRouter.put('/:id', updateFacturaState);

export default facturaRouter;