import { Sequelize } from 'sequelize';
import config from './src/database/config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
// console.log(dbConfig.host);
// console.log(dbConfig.port);
// console.log(dbConfig.database);
// console.log(dbConfig.username);
// console.log(dbConfig.password);
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: false, // Disable SQL query logs in production
  });


export default sequelize;

