import sequelize from 'sequelize'
import {Appointment} from '../model/index.js'
import {Patient} from '../model/index.js'
import moment from 'moment-timezone';

//@desc new booking page
//@route POST/active
//@access public

const getActive = async (req, res) => {
    try {
      const currentDate = new Date();
      console.log("Current date:", currentDate.toISOString());
  
      // Extract only the date part from the ISO string
      const currentDateISODate = currentDate.toISOString().split('T')[0];
      console.log("Current date (ISO format):", currentDateISODate);
  
      const appointmentall = await Appointment.findAll();
      // Find all appointments for the current date
      const appointments = appointmentall.filter(appointment => {
        console.log(appointment.date);
        return appointment.date == currentDateISODate;
      });
  
      if (appointments.length === 0) {
        return res.status(200).json(appointments);
      }
  
      // Extract patientIds from appointments
      const patientIds = appointments.map(appointment => appointment.patientId);
  
      // Find patients corresponding to the patientIds
      const patients = await Patient.findAll({
        where: {
          id: patientIds
        }
      });
  
      // Combine appointment details with patient information
      const activeAppointments = appointments.map(appointment => {
        const patient = patients.find(patient => patient.id === appointment.patientId);
        return {
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          patient: {
            name: patient.name,
            place: patient.place,
            phone: patient.phone,
            email: patient.email
          }
        };
      });
  
      // Send the combined data in JSON format
      res.status(200).json(activeAppointments);
    } catch (err) {
      // Handle errors
      console.error('Error fetching active appointments:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
}

const getHistory = async (req, res) => {
    try 
    {
      const currentDate = new Date();
      console.log("Current date:", currentDate.toISOString());
  
      // Extract only the date part from the ISO string
      const currentDateISODate = currentDate.toISOString().split('T')[0];
      console.log("Current date (ISO format):", currentDateISODate);
  
      // Fetch all appointments
      const appointments = await Appointment.findAll();
  
      // Filter appointments before the current date
      const historyAppointments = appointments.filter(appointment => {
        // Extract only the date part from the appointment date
        //const appointmentDateISODate = appointment.date.toISOString().split('T')[0];
        //console.log("Appointment date (ISO format):", appointmentDateISODate);
        console.log(appointment.date);
        return appointment.date < currentDateISODate;
      });
  
      if (historyAppointments.length === 0) {
        return res.status(200).json({ message: 'No appointments found in history' });
      }
  
      // Extract patientIds from appointments
      const patientIds = historyAppointments.map(appointment => appointment.patientId);
  
      // Find patients corresponding to the patientIds
      const patients = await Patient.findAll({
        where: {
          id: patientIds
        }
      });
  
      // Combine appointment details with patient information
      const combinedAppointments = historyAppointments.map(appointment => {
        const patient = patients.find(patient => patient.id === appointment.patientId);
        return {
          date: appointment.date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          patient: {
            name: patient.name,
            place: patient.place,
            phone: patient.phone,
            email: patient.email
          }
        };
      });
  
      // Send the combined data in JSON format
      res.status(200).json(combinedAppointments);
    } 
    catch (err) 
    {
      // Handle errors
      console.error('Error fetching appointment history:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

const createBooking = async (req, res) => {
  try {
    // Extract patient information from the request body
    const { name, place, phone, email } = req.body;

    // Create a new patient
    const patient = await Patient.create({ name, place, phone, email });

    // Extract start time and end time from the request URL parameters
    const startTimeStr = req.query.start_time;
    const endTimeStr = req.query.end_time;
    console.log("start time url:", startTimeStr);
    console.log(endTimeStr);

    // Parse start and end time strings with the timezone of Kolkata ('Asia/Kolkata')
    const startTime = moment.tz(startTimeStr, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Kolkata');
    const endTime = moment.tz(endTimeStr, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Kolkata');
    const startTimeOnly = startTime.format('HH:mm:ss');
    const endTimeOnly = endTime.format('HH:mm:ss');
    console.log("start time:", startTimeOnly);
    console.log(endTimeOnly);

    // Create a new appointment
    await Appointment.create({
      date: new Date(),
      start_time: startTimeOnly,
      end_time: endTimeOnly,
      patientId: patient.id,
      email,
    });

    res.status(201).json({ message: 'Booking created successfully.' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createBooking, getActive, getHistory };
