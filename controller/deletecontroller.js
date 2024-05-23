import sequelize from 'sequelize'
import {Appointment} from '../model/index.js'
import {Patient} from '../model/index.js'

//@desc delete booking page
//@route DELETE/delete
//@access public

const fetchSlots = async (req, res) => {
  try {
      // Extract email from request URL parameters
      const { email } = req.query;

      // Find patient(s) with the provided email
      const patients = await Patient.findAll({ where: { email } });

      if (!patients.length) {
          return res.status(404).json({ message: 'No patient found with the provided email.' });
      }

      // Get patient IDs
      const patientIds = patients.map(patient => patient.id);

      // Find appointments for the patient IDs
      const appointments = await Appointment.findAll({ where: { patientId: patientIds } });

      // Extract relevant information from appointments and patients
      const slots = appointments.map(appointment => ({
          id: appointment.patientId,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          name: patients.find(patient => patient.id === appointment.patientId).name,
          place: patients.find(patient => patient.id === appointment.patientId).place,
          phone: patients.find(patient => patient.id === appointment.patientId).phone
      }));

      // Return the slots in JSON format
      res.json({ slots });
  } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBooking = async (req, res) => 
{
  try 
  {
    const { id } = req.query; // Extract patient ID from URL parameters
    console.log(id);

    //Find the patient entry corresponding to the provided ID
    const patient = await Patient.findByPk(id);

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
    }

    //Delete the patient entry from the Patient table
    await patient.destroy();

    //Find all appointments associated with the patient ID of the deleted patient
    const appointments = await Appointment.findAll({ where: { patientId: id } });

    //Delete all appointments associated with the patient ID from the Appointment table
    await Promise.all(appointments.map(appointment => appointment.destroy()));

    return res.status(200).json({ message: 'Booking deleted successfully.' });
  } 
    catch (error) 
    {
      console.error('Error deleting booking:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  
};
  
export { deleteBooking, fetchSlots};