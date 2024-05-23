import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(
    "hospitaljs",
    "root",
    "Karthi@2002",
    {
        host: '127.0.0.1',
        dialect: 'mysql'
    }
)

sequelize.authenticate().then(() => {
    // console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.log(process.env.MYSQL_PASSWORD + "&&&")
    console.error('Unable to connect to the database: ', error);
 });