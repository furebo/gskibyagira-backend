'use strict';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath,pathToFileURL } from 'url';

dotenv.config();

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import the config file
import configFile from '../config/config.js';
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import models
/*
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
});
*/
// Assuming sequelize and db are already defined
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
/*
for (const file of files) {
  const { default: model } = await import(path.join(__dirname, file));
  db[model.name] = model(sequelize, Sequelize.DataTypes);
}
*/

for (const file of files) {
  // Convert the file path to a file:// URL
  const fileURL = pathToFileURL(path.join(__dirname, file)).href;
  
  // Dynamically import the module
  const { default: model } = await import(fileURL);
  
  // Add the model to the db object
  db[model.name] = model(sequelize, Sequelize.DataTypes);
}
// Handle model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

//database on superbase
//postgresql://postgres.ozestuweksognkrrrudx:Bamurange@123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
//Host:aws-0-eu-central-1.pooler.supabase.com
//Database name:postgres
//Port:6543
//User:postgres.ozestuweksognkrrrudx
//Password:Bamurange@123