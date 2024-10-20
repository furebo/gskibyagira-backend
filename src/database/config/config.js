require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DATABASE_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'lmis_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};

