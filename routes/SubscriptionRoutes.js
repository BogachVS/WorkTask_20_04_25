import { Router } from 'express';
import SubscriptionController from '../controllers/SubscriptionController.js';

const SubscriptionRouter = Router();

SubscriptionRouter.post('/addSubscription/:UserId', SubscriptionController.AddSubscription);
SubscriptionRouter.get('/isActiveInfo/:UserId', SubscriptionController.IsActive);
SubscriptionRouter.get('/getDays/:UserId', SubscriptionController.GetDays);
SubscriptionRouter.get('/getInfo/:UserId', SubscriptionController.GetInfo);
SubscriptionRouter.put('/updateSubscription/:UserId', SubscriptionController.UpdateSubscription);
SubscriptionRouter.put('/addDevice/:UserId', SubscriptionController.AddDevice);

export default SubscriptionRouter;
