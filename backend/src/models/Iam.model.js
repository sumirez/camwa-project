import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Iam = sequelize.define('Iam', {
  iam_id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(45),
    unique: true,
    allowNull: false
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

// Define the association here as well
Iam.associate = function (models) {
  Iam.hasMany(models.ImageAsset, {
    foreignKey: 'username',
    sourceKey: 'username'
  });
};

export default Iam;
