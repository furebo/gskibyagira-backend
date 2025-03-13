'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
    }
  }

  book.init({
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookType: DataTypes.STRING,
    bookLevel: DataTypes.STRING,
    bookCode: DataTypes.STRING,
    bookAuthor: DataTypes.STRING,
    deliveryDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'book', // Updated model name to PascalCase
  });

  return book;
};
