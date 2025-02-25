'use strict';
import {Model,DataTypes} from 'sequelize';
export default (sequelize) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedpassword: DataTypes.STRING,
    role: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    tokenExpires: DataTypes.DATE,
    isVerified:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};