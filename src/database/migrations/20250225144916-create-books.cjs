'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
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
      bookcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bookauthor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliverydate: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('books'); // This removes the books table if rolled back
  }
};
