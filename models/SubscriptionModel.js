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
            type: DataTypes.TEXT, // не все СУБД поддерживают тип данных массив (если используйте PostgreSQL, то type можно заменить на DataTypes.ARRAY(DataTypes.STRING))
            defaultValue: "[]",
            get()
            {
                const rawValue = this.getDataValue('ArrayCodes');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value)
            {
                this.setDataValue('ArrayCodes', JSON.stringify(value || []));
            }
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