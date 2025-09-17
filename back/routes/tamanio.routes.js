import { Router } from 'express';
import { getAllTamanio } from '../controllers/tamanio.controller.js';

const tamanioRouter = Router();

tamanioRouter.get('/', getAllTamanio);

export default tamanioRouter;