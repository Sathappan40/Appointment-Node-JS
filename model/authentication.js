import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import dotenv from 'dotenv'
dotenv.config()

const Authentication = sequelize.define("authentication", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true      
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync().then(() => {
    console.log('Authenticaton table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export {Authentication};