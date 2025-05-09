import { DataTypes }  from 'sequelize';
import  sequelize  from '../db.config.js';

const User = sequelize.define(
    'User',
    {
        Id:
        {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        FirstName:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        CompanyName:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email:
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:
            {
                isEmail: true
            }
        },
        Password:
        {
            type: DataTypes.STRING,
            allowNull: true,
        },
        INN:
        {
            type: DataTypes.STRING(12),
            unique: true,
            validate: {
                len: [10, 12],
                is: /^\d+$/
            }
        },
        CurrentDevicesCount:
        {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'Users',
        timestamps: false
    }
);
User.associate = (models) =>
{
    User.hasMany(models.Project, { foreignKey: 'UserId', onDelete:'CASCADE' });
    User.hasMany(models.Token, { foreignKey: 'UserId', onDelete: 'CASCADE' });
    User.hasOne(models.Subscription, { foreignKey: 'UserId', onDelete:'CASCADE' });
};
export default User;