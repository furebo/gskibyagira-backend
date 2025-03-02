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
      booktype: {
        type: Sequelize.STRING,
        allowNull: false
      },
      booklevel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      booknumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studentname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentclass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      borrowingdate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      returndate: {
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
