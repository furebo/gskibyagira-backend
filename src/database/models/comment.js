'use strict';
import {Model, DataTypes} from 'sequelize';
export default(sequelize) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.Message,{
        foreignKey: 'messageId',
        as: 'message',
        onDelete: 'CASCADE',
      })

    }
  }
  comment.init({
    id: {
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true
    },
    messageId: {
      type:DataTypes.UUID,
      field: 'messageId', // this ensures proper column name
      allowNull:false
    },
    commenterName: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
    commentText: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'comment'
  });
  return comment;
};