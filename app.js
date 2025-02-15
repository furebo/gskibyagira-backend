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
    const config = parse(process.env.DATABASE_URL);
    sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.host,
        port:config.port,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false, // Optional: Disable SQL logs in production
    });
}
 else {
    // Set up Sequelize for the local database
    sequelize = new Sequelize('lmis', 'postgres', 'furebo123', {
        host: 'localhost',
        dialect: 'postgres',
    });
}
/*
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
*/
const connectWithRetry = async (retries = 10, delay = 30000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await sequelize.authenticate();
            console.log(`✅ Database connected successfully on attempt ${attempt}`);
            return;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error);
            if (attempt < retries) {
                console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("❌ Could not connect to the database after multiple attempts.");
                process.exit(1);
            }
        }
    }
};
connectWithRetry();

// Middleware and routes
app.use(cors()); // This middleware must be before app.use(bodyParser.json()) and app.use('/api', routes) middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});



