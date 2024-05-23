import { DataTypes } from 'sequelize'
import Appointment from './appointment.js'
import { sequelize } from '../config/database.js'
import dotenv from 'dotenv'
dotenv.config()

const Patient = sequelize.define("patient", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,     
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

sequelize.sync().then(() => {
    console.log('Patient table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


export default Patient;