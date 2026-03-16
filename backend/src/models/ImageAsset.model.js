import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const ImageAsset = sequelize.define('ImageAsset', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    references: {
      model: 'iam',
      key: 'username'
    },
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('image_path');
      if (rawValue && !rawValue.includes('/')) {
        return `image_assets/${this.username}`;
      }
      return rawValue;
    }
  }
}, {
  tableName: 'image_assets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (imageAsset) => {
      if (!imageAsset.image_path || imageAsset.image_path === '') {
        imageAsset.image_path = `image_assets/${imageAsset.username}`;
      }
    },
    beforeUpdate: (imageAsset) => {
      if (!imageAsset.image_path || imageAsset.image_path === '') {
        imageAsset.image_path = `image_assets/${imageAsset.username}`;
      }
    }
  }
});

// Define the association here as well
ImageAsset.associate = function(models) {
  ImageAsset.belongsTo(models.Iam, {
    foreignKey: 'username',
    targetKey: 'username'
  });
};

export default ImageAsset;
