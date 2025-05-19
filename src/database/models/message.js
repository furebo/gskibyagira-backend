'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Message extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
        validate: {
          isEmail: true, // Ensures it's a valid email
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
      },
      message: {
        type: DataTypes.TEXT, // Use TEXT instead of STRING for longer messages
        allowNull: false, // Required field
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 0,
      },
      dislikes: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Auto-generate timestamps
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Auto-update timestamps
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages', // Explicit table name to match convention
      timestamps: true, // Enables automatic timestamps
    }
  );

  return Message;
};
