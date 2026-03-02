import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Iam = sequelize.define('Iam', {
  acc_id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(45),
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255), // Increased length for bcrypt hash
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'iam',
  timestamps: false,
});

export default Iam;
