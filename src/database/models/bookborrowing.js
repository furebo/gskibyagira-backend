'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookborrowing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bookborrowing.init({
    id: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Book_Type: DataTypes.STRING,
    Book_Level: DataTypes.STRING,
    Book_Number: DataTypes.STRING,
    Student_Name: DataTypes.STRING,
    Student_Class: DataTypes.STRING,
    Borrowing_Date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'bookborrowing',
  });
  return bookborrowing;
};