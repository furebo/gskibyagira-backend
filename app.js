import dotenv from 'dotenv';
dotenv.config();
import  parse  from 'pg-connection-string';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/index.js';
import Sequelize from 'sequelize';
import cors from 'cors';
import connectToDatabase from './databaseConfig.js';

const app = express();
const PORT = process.env.PORT;

// Check current environment
const isProduction = process.env.NODE_ENV === 'production';
console.log("let check the environment is isProduction: ",isProduction)

console.log("Current Environment:", process.env.NODE_ENV);
console.log("Database URL:", process.env.DATABASE_URL);

let sequelize;
if (isProduction) {
    connectToDatabase()
    .then(() => {
      console.log('Connected to the database');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to the database:', err);
      process.exit(1);
    }
    )
}

// const connectWithRetry = async (retries = 10, delay = 30000) => {
//     for (let attempt = 1; attempt <= retries; attempt++) {
//         try {
//             await sequelize.authenticate();
//             console.log(`✅ Database connected successfully on attempt ${attempt}`);
//             return;
//         } catch (error) {
//             console.error(`❌ Attempt ${attempt} failed:`, error);
//             if (attempt < retries) {
//                 console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
//                 await new Promise(resolve => setTimeout(resolve, delay));
//             } else {
//                 console.error("❌ Could not connect to the database after multiple attempts.");
//                 process.exit(1);
//             }
//         }
//     }
// };


app.use(cors()); // This middleware must be before app.use(bodyParser.json()) and app.use('/api', routes) middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});

//connectWithRetry();



