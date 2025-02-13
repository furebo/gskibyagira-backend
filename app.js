console.log("🚀 Starting application...");
import db from './src/database/models/index.js';
console.log("✅ Database models loaded:", Object.keys(db));


import dotenv from 'dotenv';
dotenv.config();
import  parse  from 'pg-connection-string';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/index.js';
import Sequelize from 'sequelize';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Check current environment
const isProduction = process.env.NODE_ENV === 'production';
console.log("let check the environment is isProduction: ",isProduction)

console.log("Current Environment:", process.env.NODE_ENV);
console.log("Database URL:", process.env.DATABASE_URL);

// Set up Sequelize configuration based on environment
let sequelize;

if (isProduction) {
    // Parse and configure Sequelize with the Supabase database URL
    const config = parse(process.env.DATABASE_URL);
    config.dialect = 'postgres';
    config.ssl = { require: true, rejectUnauthorized: false };
    
    sequelize = new Sequelize(config);
} else {
    // Set up Sequelize for the local database
    sequelize = new Sequelize('lmis', 'postgres', 'furebo123', {
        host: 'localhost',
        dialect: 'postgres',
    });
}

// Test the database connection
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testDatabaseConnection();

// Middleware and routes
app.use(cors()); // This middleware must be before app.use(bodyParser.json()) and app.use('/api', routes) middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});

