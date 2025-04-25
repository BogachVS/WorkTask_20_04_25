import SubscriptionService from '../services/SubscriptionServices.js';
class SubscriptionController
{
    async IsActive(res, req)
    {
        try
        {
            const answer = await SubscriptionService.IsActiveSubscription(req.params.UserId);
            return res.status(200).json(answer);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async GetDays(res, req)
    {
        try
        {
            const days = await SubscriptionService.GetDaysRemain(req.params.UserId);
            return res.status(200).json(days);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async GetInfo(res, req)
    {
        try
        {
            const subscription = await SubscriptionService.GetSubscriptionInfo(req.params.UserId);
            return res.status(200).json(subscription);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async UpdateSubscription(res, req)
    {
        try
        {
            await SubscriptionService.ChangeSubscription(req.params.UserId, req.body);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }

    async AddDevice(res, req)
    {
        try
        {
            await SubscriptionService.AddDevice(req.params.UserId, req.body);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.code });
        }
    }
}
export default new SubscriptionController();