import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';

const DashboardRouter = Router();

DashboardRouter.get('/', getDashboardData);
// DashboardRouter.get('/:id', getPedidoById);
// DashboardRouter.post('/', createPedido);
// router.put('/', updatePostre);

export default DashboardRouter;