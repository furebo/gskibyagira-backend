'use strict';
import {Model, DataTypes} from 'sequelize';
export default (sequelize) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  event.init({
    id: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    heading: DataTypes.STRING,
    description: DataTypes.STRING,
    image_url: DataTypes.STRING,
    is_active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};