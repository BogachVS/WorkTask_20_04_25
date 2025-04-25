import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

const Project = sequelize.define(
    'Project',
    {
        Id:
        {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        ProjectName:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        ProjectDevicesCount:
        {
            type: DataTypes.INTEGER,
        },
        ProjectType:
        {
            type: DataTypes.ENUM('SDK', 'mobile'),
            allowNull: false
        },
        ApiKey:
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        UserId:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:
            {
                model: 'Users',
                key: 'Id'
            }
        }
    },
    {
        tableName: 'Projects',
        timestamps: false
    }
);
Project.associate = (models) =>
{
    Project.belongsTo(models.User, { foreignKey: 'UserId' });
}
export default Project;