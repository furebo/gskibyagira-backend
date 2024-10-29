import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';
import Sequelize from 'sequelize';
import cors from 'cors';
const app = express();
const PORT  = process.env.PORT;
//require('./src/services/auth');

// Set up Sequelize
const sequelize = new Sequelize('lmis', 'postgres', 'furebo123', {
    host: 'localhost',
    dialect: 'postgres'
});

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

//middleware and routes 
app.use(cors()); //this middleware must be before app.use(bodyParser.json()) and app.use('/api',routes) middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',routes)



app.listen(PORT, ()=>{
    console.log("App is listening on port "+ PORT);
})
