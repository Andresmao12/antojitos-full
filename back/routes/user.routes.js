import { Router } from 'express';
import { getAll, createUser } from '../controllers/user.controller.js';

const UserRouter = Router();

UserRouter.get('/', getAll);
// router.get('/:id', getPostreById);
UserRouter.post('/', createUser);
// router.put('/', updatePostre);

export default UserRouter;