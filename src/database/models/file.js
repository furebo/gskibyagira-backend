'use strict';
import user from "./user.js";
import {Model, DataTypes} from 'sequelize';
export default (sequelize) => {
  class file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
            // Each file belongs to one user
      file.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'owner',
      });
    }
  }
  file.init({
    id: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
   filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false, // reference to User
  },
  }, {
    sequelize,
    modelName: 'file',
  });
  return file;
};