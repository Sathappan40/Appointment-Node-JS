import sequelize from 'sequelize'
import {Appointment} from '../model/index.js'
import {Patient} from '../model/index.js'
import {AppointmentSetting} from '../model/appointment_setting.js'
import moment from 'moment-timezone';
import { DateTime } from 'luxon';


//@desc available page
//@route GET/slots
//@access public

const getSlots = async (req, res) => {
    const timeZone = 'Asia/Kolkata'; // Indian Standard Time (IST)

    console.log(req.params.date);
    console.log('$$$$');
    const requestedDate = new Date(req.query.date);
    console.log(requestedDate);
    console.log('####');

    // Find the appointment settings for the requested day
    const appointmentSettings = await AppointmentSetting.findOne({ where: { day: requestedDate.toLocaleString('en-US', { weekday: 'long' }) } });

    if (!appointmentSettings) {
        return res.status(400).json({ message: 'Appointment settings not found for the requested day.' });
    }

    // Initialize an array to store the booked slots
    const bookedSlots = [];

    // Find all booked slots for the requested day
    const appointmentsOnDay = await Appointment.findAll({ where: { date: requestedDate } });

    appointmentsOnDay.forEach(appointment => {
        if (appointment.start_time) 
        {   
            console.log("Starttime:", appointment.start_time)
            // Combine the time string with a fixed date component
            const startTimeString = `2024-05-14 ${appointment.start_time}`;
            // Create Date objects
            const startTimeDate = new Date(startTimeString);
            console.log("startTimeDate:", startTimeDate);

            console.log("endtime:", appointment.end_time);
            const endTimeString = `2024-05-14 ${appointment.end_time}`;
            const endTimeDate = new Date(endTimeString);
            console.log("endTimeDate:", endTimeDate);

            const startTime = startTimeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
            console.log(startTime);
            console.log("####")
            const endTime = endTimeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
            console.log(endTime);
            bookedSlots.push({ startTime, endTime });
        }
    });

    // Initialize an array to store the available slots
    const availableSlots = [];

    // Calculate the start time and end time for available slots based on appointment settings
    const currentDateTime = new Date();

    const [startHours, startMinutes] = appointmentSettings.day_start_time.split(':').map(Number);
    const [endHours, endMinutes] = appointmentSettings.day_end_time.split(':').map(Number);

    // Construct Date objects with the extracted hours and minutes
    const startTime = new Date(currentDateTime);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(currentDateTime);
    endTime.setHours(endHours, endMinutes, 0, 0);

    // Extract the minutes from the slot_timing string
    const slotMinutes = parseInt(appointmentSettings.slot_timing.split(':')[1]);

    // Calculate the duration of each slot in milliseconds
    const slotDuration = slotMinutes * 60000; // Convert minutes to milliseconds

    // Find the nearest future slot after the current time
    const nearestFutureSlotTime = new Date();
    nearestFutureSlotTime.setMilliseconds(0);
    nearestFutureSlotTime.setSeconds(0);
    nearestFutureSlotTime.setMinutes(Math.ceil(nearestFutureSlotTime.getMinutes() / slotMinutes) * slotMinutes);
    if (nearestFutureSlotTime.getMinutes() >= 60) 
    {
        // Reset minutes to 0
        nearestFutureSlotTime.setMinutes(0);
        // Increment hours by 1
        nearestFutureSlotTime.setHours(nearestFutureSlotTime.getHours() + 1);
    }
 
     // Iterate over the time range to find available slots starting from the nearest future slot
     let currentTime = nearestFutureSlotTime;

    // Define lunch time and break time in IST
    const lunchStartTime = moment('2024-05-23T13:30:00');
    const lunchEndTime = moment('2024-05-23T14:29:00');
    const breakStartTime = moment('2024-05-23T17:00:00');
    const breakEndTime = moment('2024-05-23T17:29:00');

    while (currentTime < endTime) 
    {
        const slotEndTime = new Date(currentTime.getTime() + slotDuration);
        const slotStartTimeString = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
        const slotEndTimeString = slotEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
    
        // Check if the slot is within lunchtime or breaktime range
        if ((moment(currentTime).isBetween(lunchStartTime, lunchEndTime, undefined, '[]')) ||
            (moment(currentTime).isBetween(breakStartTime, breakEndTime, undefined, '[]'))) 
        {
            // Skip lunchtime and breaktime slots
            currentTime = slotEndTime;
            continue;
        }
    
        // Check if the slot is available (not booked)
        let isSlotBooked = false;
        for (const bookedSlot of bookedSlots) 
        {
            const bookedStartTime = bookedSlot.startTime
            const bookedEndTime = bookedSlot.endTime;
            const currentTimeString = DateTime.fromJSDate(currentTime).setZone(timeZone).toFormat('HH:mm');
            const slotEndTimeString = DateTime.fromJSDate(slotEndTime).setZone(timeZone).toFormat('HH:mm');
            
            if (currentTimeString == bookedStartTime && slotEndTimeString == bookedEndTime) 
            {
                isSlotBooked = true;
                break;
            }
        }
    
        if (!isSlotBooked) 
        {
            availableSlots.push({ startTime: slotStartTimeString, endTime: slotEndTimeString });
        }
    
        // Move to the next slot
        currentTime = slotEndTime;
    }

    res.json({ availableSlots });
};

export { getSlots };


