import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/index.js';
import cors from 'cors';
import connectToDatabase from './databaseConfig.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Check current environment
const isProduction = process.env.NODE_ENV === 'production';
console.log("let check the environment is isProduction: ",isProduction)

console.log("Current Environment:", process.env.NODE_ENV || 'development');
console.log("Remote Database URL:", process.env.DATABASE_URL);

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

app.use(
  cors({
    origin: "https://gskibyagiraburuhukiro.netlify.app", // Allow only this frontend
    methods: "GET,POST,PUT,DELETE", // Allow necessary HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allow these headers
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);




