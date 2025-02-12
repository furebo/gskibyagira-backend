'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
    }
  }

  Book.init({
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
    modelName: 'Book', // Updated model name to PascalCase
  });

  return Book;
};
