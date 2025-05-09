import { DataTypes } from 'sequelize';
import sequelize from '../db.config.js';

const Token = sequelize.define('Token', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RefreshToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Tokens',
  timestamps: true
});

Token.associate = (models) => {
  Token.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

export default Token;
