import sequelize from 'sequelize'
import {AppointmentSetting} from '../model/appointment_setting.js'


//@desc appointment setting page
//@route POST/setting
//@access public

const createSetting = async (req, res) => {
    console.log("The request body is :", req.body);
    const { day, day_start_time, day_end_time, slot_timing } = req.body;
    if (!day || !day_start_time || !day_end_time || !slot_timing) {
      res.status(400);
      throw new Error("All fields are mandatory !");
    }

    // Check if a setting already exists for the specified day
    const existingSetting = await AppointmentSetting.findOne({ where: { day } });

    if (existingSetting) {
      // Update the existing setting
      await existingSetting.update({
        day_start_time,
        day_end_time,
        slot_timing,
      });
      res.status(200).json(existingSetting);
    } else {
      // Create a new setting
      const newSetting = await AppointmentSetting.create({
        day,
        day_start_time,
        day_end_time,
        slot_timing,
      });
      res.status(201).json(newSetting);
    }
};

export { createSetting };