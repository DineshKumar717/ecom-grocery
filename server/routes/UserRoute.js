import express from 'express';
import { register, login, isAuth, logout } from '../controllers/UserController.js';
import authUser from '../middlewares/authUser.js';

const UserRouter = express.Router();


UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get('/is-auth', authUser, isAuth);
UserRouter.get('/logout', authUser, logout);

export default UserRouter;
