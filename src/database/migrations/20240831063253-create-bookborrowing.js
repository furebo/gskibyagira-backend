'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookborrowings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      Book_Type: {
        type: Sequelize.STRING
      },
      Book_Level: {
        type: Sequelize.STRING
      },
      Book_Number: {
        type: Sequelize.STRING
      },
      Student_Name: {
        type: Sequelize.STRING
      },
      Student_Class: {
        type: Sequelize.STRING
      },
      Borrowing_Date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookborrowings');
  }
};