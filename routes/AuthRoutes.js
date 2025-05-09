import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';


const AuthRouter = Router();

AuthRouter.get('/google/url', AuthController.GetGoogleAuthURL);
AuthRouter.get('/google/callback', AuthController.GoogleOAuthCallback);
AuthRouter.post('/refresh', AuthController.RefreshToken);

export default AuthRouter;