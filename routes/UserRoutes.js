import { Router } from 'express';
import UserController from '../controllers/UserController.js';
const UserRouter = new Router();

UserRouter.post('/registration', UserController.Registration);
UserRouter.post('/login', UserController.Login);
UserRouter.get('/getInfo/:Id', UserController.GetUser);
UserRouter.put('/updateInfo/:Id', UserController.UpdateUser);
UserRouter.delete('/deleteUser/:Id', UserController.DeleteUser);

export default UserRouter;