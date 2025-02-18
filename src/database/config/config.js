import dotenv from 'dotenv';
import pg from 'pg';
import pkg from 'pg-connection-string';
const { parse } = pkg;


dotenv.config();

const config = process.env.DATABASE_URL ? parse(process.env.DATABASE_URL) : {};

export default {
  development: {
    username: "postgres",
    password: "furebo123",
    database: "lmis",
    host: "localhost",
    dialect: "postgres",
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
    username: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port || 5432, // Default Postgres port
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
