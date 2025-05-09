import SubscriptionService from '../services/SubscriptionServices.js';

class SubscriptionController
{
    /**
     * @swagger
     * /subscriptions/addSubscription:
     *   post:
     *     summary: Add a new subscription for a user
     *     tags: [Subscriptions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Subscription(add)'
     *     responses:
     *       200:
     *         description: Subscription added
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async AddSubscription(req, res)
    {
        try
        {
            const { IncludeSDK, IncludeMobile, MaxDevicesCount, ArrayCodes, SubscriptionBeginDate, SubscriptionDuration } = req.body;
            await SubscriptionService.AddSubscription(req.user.id, IncludeSDK, IncludeMobile, MaxDevicesCount, ArrayCodes, SubscriptionBeginDate, SubscriptionDuration);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }
    /**
     * @swagger
     * /subscriptions/isActiveInfo:
     *   get:
     *     summary: Check subscription activity
     *     tags: [Subscriptions]
     *     responses:
     *       200:
     *         description: Subscription status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 isActive:
     *                   type: boolean
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async IsActive(req, res)
    {
        try
        {
            const answer = await SubscriptionService.IsActiveSubscription(req.user.id);
            return res.status(200).json(answer);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * @swagger
     * /subscriptions/getDays:
     *   get:
     *     summary: Get remain days
     *     tags: [Subscriptions]
     *     responses:
     *       200:
     *         description: Days numb
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 days:
     *                   type: integer
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async GetDays(req, res)
    {
        try
        {
            const days = await SubscriptionService.GetDaysRemain(req.user.id);
            return res.status(200).json(days);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * @swagger
     * /subscriptions/getInfo:
     *   get:
     *     summary: Get subscription info
     *     tags: [Subscriptions]
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async GetInfo(req, res)
    {
        try
        {
            const subscription = await SubscriptionService.GetSubscriptionInfo(req.user.id);
            return res.status(200).json(subscription);
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * @swagger
     * /subscriptions/updateSubscription:
     *   put:
     *     summary: Update subscription
     *     tags: [Subscriptions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubscriptionUpdate'
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async UpdateSubscription(req, res) {
        try
        {
            const rowsAffected = await SubscriptionService.ChangeSubscription(req.user.id, req.body);
            return res.status(200).json({ success: true, rowsAffected });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * @swagger
     * /subscriptions/addDevice:
     *   put:
     *     summary: Add device
     *     tags: [Subscriptions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ApiKey:
     *                 type: string
     *                 example: "A3F7D9E21C4B08A55E6D2F1B9C0E7D3F"
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 error:
     *                   type: string
     *                   example: "USER_NOT_FOUND"
     */
    async AddDevice(req, res) {
        try
        {
            await SubscriptionService.AddDevice(req.user.id, req.body);
            return res.status(200).json({ success: true });
        }
        catch (error)
        {
            return res.status(400).json({ error: error.message });
        }
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription(add):
 *       type: object
 *       properties:
 *         IncludeSDK:
 *           type: boolean
 *           example: true
 *         IncludeMobile:
 *           type: boolean
 *           example: false
 *         MaxDevicesCount:
 *           type: integer
 *           example: 5
 *         ArrayCodes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["QR","Barcode","Datamatrix"]
 *         SubscriptionBeginDate:
 *           type: string
 *           format: date-time
 *         SubscriptionDuration:
 *           type: integer
 *           example: 365    
 * 
 *     Subscription:
 *       type: object
 *       properties:
 *         IncludeSDK:
 *           type: boolean
 *           example: true
 *         IncludeMobile:
 *           type: boolean
 *           example: false
 *         MaxDevicesCount:
 *           type: integer
 *           example: 5
 *         ArrayCodes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["QR","Barcode","Datamatrix"]
 *         SubscriptionBeginDate:
 *           type: string
 *           format: date-time
 *         SubscriptionDuration:
 *           type: integer
 *           example: 365
 *         UserId:
 *           type: integer
 *           example: 1
 * 
 *     SubscriptionUpdate:
 *       type: object
 *       properties:
 *         IncludeSDK:
 *           type: boolean
 *           example: false
 *         IncludeMobile:
 *           type: boolean
 *           example: true
 *         MaxDevicesCount:
 *           type: integer
 *           example: 25
 *         ArrayCodes:
 *           type: array
 *           items:
 *             type: string
 *         SubscriptionBeginDate:
 *           type: string
 *           format: date-time
 *         SubscriptionDuration:
 *           type: integer
 *           example: 100
 */
export default new SubscriptionController();