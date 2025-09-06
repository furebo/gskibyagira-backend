import dotenv from 'dotenv';
import pg from 'pg';
import pkg from 'pg-connection-string';
const { parse } = pkg;


dotenv.config();

const config = process.env.DATABASE_URL ? parse(process.env.DATABASE_URL) : {};

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DIALECT,
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
