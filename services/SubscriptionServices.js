import Subscription from '../models/SubscriptionModel.js';
import User from '../models/UserModel.js';
import Project from '../models/ProjectModel.js';
import sequelize from '../db.config.js';
class SubscriptionService
{
    async IsActiveSubscription(UserId)
    {
        try
        {
            const subscription = await Subscription.findOne({ where: { UserId } });
            if (!subscription)
            {
                throw new Error("Susbscription not found");
            }
            const startDate = new Date(subscription.SubscriptionBeginDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + subscription.SubscriptionDuration);
            return new Date() < endDate;
        }
        catch(error)
        {
            throw error
        }
    }
    async GetDaysRemain(UserId)
    {
        try
        {
            const subscription = await Subscription.findOne({ where: { UserId } });
            if (!subscription)
            {
                throw new Error("Susbscription not found");
            }
            const result = await sequelize.query(
                `SELECT 
     DATEDIFF(day, GETDATE(), DATEADD(day, SubscriptionDuration, SubscriptionBeginDate)) AS DaysRemaining
   FROM Subscriptions
   WHERE UserId = :userId`,
                {
                    replacements: { userId: UserId },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            return result[0].DaysRemaining;
        }
        catch (error)
        {
            throw error
        }

    }
    async GetSubscriptionInfo(UserId)
    {
        try
        {
            return await Subscription.findOne({
                    where: { UserId },
                    attributes: ['IncludeSDK', 'IncludeMobile', 'MaxDevicesCount', 'ArrayCodes', 'SubscriptionBeginDate','SubscriptionDuration']
                });
        }
        catch (error)
        {
            throw error
        }
    }
    async AddSubscription(UserId, IncludeSDK, IncludeMobile, MaxDevicesCount, ArrayCodes, SubscriptionBeginDate, SubscriptionDuration)
    {
        try
        {
            const subscription = await Subscription.findOne({ where: { UserId } });
            if (subscription)
            {
                throw new Error("Susbscription already exist");
            }
            await Subscription.create(
                {
                    IncludeSDK,
                    IncludeMobile,
                    MaxDevicesCount,
                    ArrayCodes,
                    SubscriptionBeginDate,
                    SubscriptionDuration,
                    UserId
                }
            );
        }
        catch (error)
        {
            throw error
        }
    }
    async ChangeSubscription(UserId, Data)
    {
        try
        {
            const subscription = await Subscription.findOne({ where: { UserId } });
            if (!subscription)
            {
                throw new Error("Susbscription not found");
            }
            const [update] = await Subscription.update(Data, { where: { UserId } });
            if (update === 0)
            {
                throw new Error();
            }
            return update;
        }
        catch (error)
        {
            throw error;
        }
    }
    async AddDevice(UserId, ApiKey)
    {
        try
        {
            if (this.IsActiveSubscription(UserId))
            {
                const transaction = sequelize.transaction();
                const user = await User.findOne({
                    where: { Id: UserId },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });
                if (!user)
                {
                    throw new Error("The user doesn't exist");
                }
                const subscription = await Subscription.findOne({ where: { UserId }, transaction });
                if (!subscription)
                {
                    throw new Error("Subscription not found");
                }
                const project = await Project.findOne({ where: { ApiKey, UserId }, transaction });
                if (!project)
                {
                    throw new Error("Project doesn't exist");
                }
                if (user.CurrentDevicesCount < subscription.MaxDevicesCount)
                {
                    await Promise.all([
                        Project.update(
                            { ProjectDevicesCount: sequelize.literal('ProjectDevicesCount + 1') },
                            {
                                where: { Id: project.Id },
                                transaction
                            }
                        ),
                        User.update(
                            { CurrentDevicesCount: sequelize.literal('CurrentDevicesCount + 1') },
                            {
                                where: { Id: UserId },
                                transaction
                            }
                        )
                    ]);
                }
                else
                {
                    throw new Error("The device limit has been reached");
                }
            }
            else
            {
                throw new Error("The subscription isn't active");
            }
        }
        catch (error)
        {
            throw error;
        }
    }
}
export default new SubscriptionService();