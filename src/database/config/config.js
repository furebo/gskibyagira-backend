//require('dotenv').config(); // Load .env file
import dotenv from 'dotenv';
import pg from "pg";
dotenv.config();

export default {
  development: {
    username: "postgres",
    password: "furebo123",
    database: "lmis",
    host: "localhost",
    dialect: "postgres"
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
