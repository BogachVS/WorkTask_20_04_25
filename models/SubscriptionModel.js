import { DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

const Subscription = sequelize.define(
    'Subscription',
    {
        IncludeSDK:
        {
            type: DataTypes.BOOLEAN
        },
        IncludeMobile:
        {
            type: DataTypes.BOOLEAN
        },
        MaxDevicesCount:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ArrayCodes:
        {
            type: DataTypes.TEXT // тут должен храниться массив строк, но я не знаю какой тип данных есть в MSSQL Server для этого
        },
        SubscriptionBeginDate:
        {
            type: DataTypes.DATE,
            allowNull: false
        },
        SubscriptionDuration:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references:
            {
                model: 'Users',
                key: 'Id'
            }
        }
    },
    {
        tableName: 'Subscriptions',
        timestamps: false
    }
);
Subscription.associate = (models) =>
{
    Subscription.belongsTo(models.User, { foreignKey: 'UserId' });
};
export default Subscription;