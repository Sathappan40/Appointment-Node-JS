import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import dotenv from 'dotenv'
dotenv.config()

const AppointmentSetting = sequelize.define("appointmentsetting", {
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day_start_time: {
        type: DataTypes.TIME,
        allowNull: false,     
    },
    day_end_time: {
        type: DataTypes.TIME,
        allowNull: false,     
    },
    slot_timing: {
        type: DataTypes.TIME,
        allowNull: false
    }

});
sequelize.sync().then(() => {
    console.log('AppointmentSetting table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export {AppointmentSetting};

