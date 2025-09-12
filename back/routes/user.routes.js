import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
// userRouter.get('/:id', getUserById);
// userRouter.put('/:id', updateUser);
// userRouter.delete('/:id', deleteUser);

export default userRouter;