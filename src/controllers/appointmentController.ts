import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { Appointment } from '../models/appointment';
import { CancelAppointmentRequest, CreateAppointmentRequest, customErrorType, decodeCancelAppointmentRequest, decodeCreateAppointmentRequest, decodecustomErrorType, decodeModifyAppointmentRequest, decodeString, ModifyAppointmentRequest } from '../utils/types';

export class AppointmentController {

  static async createAppointment(req: Request,res: Response) {
    const createAppointmentPayload:CreateAppointmentRequest | null = decodeCreateAppointmentRequest(req.body)
    // Input validation
    if ( createAppointmentPayload === null) {
        res.status(400).json({ error: 'Incorrect Payload' });
        return;
    }
      // Call the AppointmentService to handle appointment creation
    const newAppointment: Appointment | customErrorType = AppointmentService.createAppointment(createAppointmentPayload);
    const isError = decodecustomErrorType(newAppointment)
    if (isError !== null){
        res.status(409).json({ error: 'Booking Failed', message: isError.message });
        return;
    }
    // Respond with a success message and the created appointment details
    res.status(200).json({
        message: 'Appointment booked successfully',
        appointment: newAppointment
    });
  }

  static async viewAppointmentDetails(req: Request, res: Response) {
    // Extract the patient email from the request parameters
    const email = decodeString(req.params.email);
    if (email === null) {
      res.status(400).json({ error: 'Incorrect email' });
      return;
    }
    // Call the AppointmentService to fetch the appointment details
    const appointment = AppointmentService.getAppointmentByPatientEmail(email);
    // If the appointment is not found, respond with a 404 Not Found status
    if (appointment.length===0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    // Respond with the appointment details
    res.status(200).json(appointment);
  }

  static async viewAllAppointmentsByDoctor(req: Request, res: Response) {
    // Extract the doctor name from the request parameters
    const doctorName = decodeString(req.params.doctorName);
    if (doctorName === null) {
      res.status(400).json({ error: 'Incorrect doctor name' });
      return;
    }
    // Call the AppointmentService to fetch all appointments by doctor
    const appointments = AppointmentService.getAppointmentsByDoctor(doctorName);
    if (appointments.length===0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    // Respond with the appointment details
    res.status(200).json(appointments);
  }

  static async modifyAppointment(req: Request, res: Response) {
    // Extract the email, original time slot, and new time slot from the request body
    const modifyAppointmentPayload: ModifyAppointmentRequest | null = decodeModifyAppointmentRequest(req.body);
    if (modifyAppointmentPayload === null) {
      res.status(400).json({ error: 'Incorrect Payload' });
      return;
    }
    // Call the AppointmentService to modify the appointment
    const modifyAppointmentResp = AppointmentService.modifyAppointment(modifyAppointmentPayload);
    const isError = decodecustomErrorType(modifyAppointmentResp)
    if (isError !== null){
        res.status(isError.statusCode).json({ error: isError.message });
        return;
    }
    // If the appointment is not found, respond with a 404 Not Found status
    // Respond with a success message
    res.status(200).json({ message: 'Appointment modified successfully' });
  }

  static async cancelAppointment(req: Request, res: Response) {
    // Extract the email and time slot from the request body
    const cancelAppointmentRequest: CancelAppointmentRequest | null = decodeCancelAppointmentRequest(req.body);
    if (cancelAppointmentRequest === null) {
      res.status(400).json({ error: 'Incorrect Payload' });
      return;
    }
    // Call the AppointmentService to cancel the appointment
    const deleteAppointmentResponse = AppointmentService.deleteAppointment(cancelAppointmentRequest);
    const isError = decodecustomErrorType(deleteAppointmentResponse)
    if (isError !== null){
        res.status(isError.statusCode).json({ error: isError.message });
        return;
    }
    // Respond with a success message
    res.status(200).json({ message: 'Appointment canceled successfully' });
  }
}
