import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = Router();

// Route for checking health of the application
router.get('/health', (_, res) => {res.status(200).json({ message: 'Welcome to the Doctor Appointment Booking System!' })});

// Route for creating an appointment
router.post('/appointment', AppointmentController.createAppointment);

// Route for viewing a patient's appointment details by email
router.get('/appointments/:email', AppointmentController.viewAppointmentDetails);

// Route for viewing all appointments by doctor
router.get('/appointments/doctor/:doctorName', AppointmentController.viewAllAppointmentsByDoctor);

// Route for modifying an appointment
router.put('/appointment', AppointmentController.modifyAppointment);

// Route for canceling an appointment
router.delete('/appointment', AppointmentController.cancelAppointment);

// Route for catching all other endpoints
router.all('*', (_, res) => {res.status(404).json({ error: 'Endpoint not found' })});

export { router };
