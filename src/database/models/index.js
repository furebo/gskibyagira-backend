'use strict';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';

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

// Load all models dynamically
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

// **Wrap everything inside an async function and await it**
const loadModels = async () => {
  for (const file of files) {
    const fileURL = pathToFileURL(path.join(__dirname, file)).href;
    const { default: modelFactory } = await import(fileURL); // modelFactory is a function
    const model = modelFactory(sequelize); // Call the function to get the model
    db[model.name] = model; // ✅ Now storing model in db
  }

  // Handle model associations **after models are loaded**
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  console.log('Loaded models:', Object.keys(db));
};

await loadModels(); // ✅ Wait for models to load **before exporting**
export default db;

//database on superbase
//postgresql://postgres.ozestuweksognkrrrudx:Bamurange@123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
//Host:aws-0-eu-central-1.pooler.supabase.com
//Database name:postgres
//Port:6543
//User:postgres.ozestuweksognkrrrudx
//Password:Bamurange@123