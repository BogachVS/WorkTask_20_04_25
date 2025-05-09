import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController.js';
import verifyToken from '../middleware/VerifyTokenMiddleware.js'

const SubscriptionRouter = Router();

SubscriptionRouter.post('/addSubscription', verifyToken, SubscriptionController.AddSubscription);
SubscriptionRouter.get('/isActiveInfo', verifyToken, SubscriptionController.IsActive);
SubscriptionRouter.get('/getDays', verifyToken, SubscriptionController.GetDays);
SubscriptionRouter.get('/getInfo', verifyToken, SubscriptionController.GetInfo);
SubscriptionRouter.put('/updateSubscription', verifyToken, SubscriptionController.UpdateSubscription);
SubscriptionRouter.put('/addDevice', verifyToken, SubscriptionController.AddDevice);

export default SubscriptionRouter;
