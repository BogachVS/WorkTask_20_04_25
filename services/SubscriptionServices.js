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
            const startDate = new Date(subscription.SubscriptionBeginDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + subscription.SubscriptionDuration);
            return new Date() < endDate;
        }
        catch
        (error)
        {
            return error
        }
    }
    async GetDaysRemain(UserId)
    {
        try
        {
            const result = await sequelize.query(`
                SELECT DATEDIFF(NOW(), StartDate) AS days_passed
                FROM Subscriptions
                WHERE UserId = :userId
            `, {
                replacements: { userId: UserId },
                type: sequelize.QueryTypes.SELECT
            });
            return result;
        }
        catch (error)
        {
            return error
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
            return error
        }
    }
    async AddSubscription(UserId)
    {

    }
    async ChangeSubscription(UserId, Data)
    {
        try
        {
            await Subscription.update(Data, { where: { UserId } });
        }
        catch (error)
        {
            return error;
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
                const subscription = await Subscription.findOne({ where: { UserId }, transaction });
                const project = await Project.findOne({ where: { ApiKey, UserId }, transaction });
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
            return error;
        }
    }
}
export default new SubscriptionService();