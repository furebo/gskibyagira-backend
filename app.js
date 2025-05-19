import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/index.js';
import cors from 'cors';
import connectToDatabase from './databaseConfig.js';

const app = express();
const PORT = process.env.PORT || 5000;

//Apply CORS Middleware First
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this frontend
    methods: "GET,POST,PUT,DELETE,PATCH", // Allow necessary HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allow these headers
  })
);

//Add CORS Preflight Handling (for OPTIONS requests)
app.options('*', cors());

//Body Parsing Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Apply Routes
app.use('/api', routes);

//Database Connection in Production
const isProduction = process.env.NODE_ENV === 'development';
if (isProduction || !isProduction) {
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
    });
} else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
