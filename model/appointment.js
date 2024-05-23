import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import Patient from './patient.js'

import dotenv from 'dotenv'
dotenv.config()

const Appointment = sequelize.define("appointment", {
    date: {
        type: DataTypes.DATE,
        allowNull: false,     
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,     
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Disable automatic timestamps
});

sequelize.sync().then(() => {
    console.log('Appointment table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});



export default Appointment;