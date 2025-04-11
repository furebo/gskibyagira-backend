'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bookborrowings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      Book_Type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Book_Level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Book_Number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Student_Name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    
      Student_Class: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Status:{
        type:Sequelize.STRING,
        allowNull:true
      },
      Borrowing_Date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Return_Date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bookborrowings'); // This removes the bookborrowings table if rolled back
  }
};
