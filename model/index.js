import Appointment from './appointment.js'
import Patient from './patient.js'

Patient.hasMany(Appointment, { onDelete: 'CASCADE' })
Appointment.belongsTo(Patient)

export { Appointment, Patient }