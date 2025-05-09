import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import verifyToken from '../middleware/VerifyTokenMiddleware.js'

const UserRouter = new Router();

UserRouter.post('/registration', UserController.Registration);
UserRouter.post('/login', UserController.Login);
UserRouter.get('/getInfo', verifyToken, UserController.GetUser);
UserRouter.put('/updateInfo', verifyToken, UserController.UpdateUser);
UserRouter.delete('/deleteUser', verifyToken, UserController.DeleteUser);

export default UserRouter;