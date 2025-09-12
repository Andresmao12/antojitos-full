import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.get('/', getDashboardData);
// DashboardRouter.get('/:id', getPedidoById);
// DashboardRouter.post('/', createPedido);
// router.put('/', updatePostre);

export default dashboardRouter;