import { Appointment } from '../models/appointment';
import { Patient } from '../models/patient';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { validateAndConvertTimeRange } from '../utils/dateUtils';
import { CancelAppointmentRequest, CreateAppointmentRequest, customErrorType, decodecustomErrorType, decodeValidTimeRange, ModifyAppointmentRequest } from '../utils/types';

export class AppointmentService {

  static createAppointment(createAppointmentPayload: CreateAppointmentRequest): Appointment | customErrorType {
    // Create the patient object
    const patient: Patient = {
        firstName: createAppointmentPayload.firstName,
        email: createAppointmentPayload.email,
        lastName: createAppointmentPayload.lastName,
        role: 'Patient'
    }

    const convertedTimeRange = validateAndConvertTimeRange(createAppointmentPayload.timeSlot);
    const isTimeRangeValid = decodecustomErrorType(convertedTimeRange);
    if (isTimeRangeValid !== null) {
      return isTimeRangeValid;
    }
    const decodedConvertedTimeRange = decodeValidTimeRange(convertedTimeRange);
    if(decodedConvertedTimeRange === null) {
      return {statusCode: 400, message: 'Invalid time range'};
    }
    const newAppointment: Appointment = { patient, startTime: decodedConvertedTimeRange.startTime, endTime: decodedConvertedTimeRange.endTime, doctorName: createAppointmentPayload.doctorName };

    // Add the new appointment to the repository (In-memory or database)
    return AppointmentRepository.addAppointment(newAppointment);
  }

  static getAppointmentByPatientEmail(email: string): Appointment[] {
    return AppointmentRepository.getAppointmentByPatientEmail(email);
  }

  static getAppointmentsByDoctor(doctorName: string): Appointment[] {
    return AppointmentRepository.getAppointmentsByDoctor(doctorName);
  }

  static modifyAppointment(modifyAppointmentRequest: ModifyAppointmentRequest): Appointment | customErrorType {
    const convertedNewTimeRange = validateAndConvertTimeRange(modifyAppointmentRequest.newTimeSlot);
    const convertedOrignalTimeRange = validateAndConvertTimeRange(modifyAppointmentRequest.originalTimeSlot);
    const isNewTimeRangeValid = decodecustomErrorType(convertedNewTimeRange);
    const isOrignalTimeRangeValid = decodecustomErrorType(convertedOrignalTimeRange);
    if (isNewTimeRangeValid !== null) {
      return isNewTimeRangeValid;
    }
    if (isOrignalTimeRangeValid !== null) {
      return isOrignalTimeRangeValid;
    }

    const decodedConvertedOrignalTimeRange = decodeValidTimeRange(convertedOrignalTimeRange);
    if(decodedConvertedOrignalTimeRange === null) {
      return {statusCode: 400, message: 'Invalid Orignal time range'};
    }
    const decodedConvertedNewTimeRange = decodeValidTimeRange(convertedNewTimeRange);
    if(decodedConvertedNewTimeRange === null) {
      return {statusCode: 400, message: 'Invalid New time range'};
    }
    const modifyAppointment = { 
      email: modifyAppointmentRequest.email, 
      originalStartTime: decodedConvertedOrignalTimeRange.startTime, 
      originalEndTime: decodedConvertedOrignalTimeRange.endTime, 
      newStartTime: decodedConvertedNewTimeRange.startTime, 
      newEndTime: decodedConvertedNewTimeRange.endTime 
    };
    return AppointmentRepository.modifyAppointment(modifyAppointment);
  }

  static deleteAppointment(cancelAppointmentRequest: CancelAppointmentRequest): Boolean | customErrorType {
    const convertedTimeRange = validateAndConvertTimeRange(cancelAppointmentRequest.startTime + " - " + cancelAppointmentRequest.endTime);
    const isNewTimeRangeValid = decodecustomErrorType(convertedTimeRange);
    if (isNewTimeRangeValid !== null) {
      return isNewTimeRangeValid;
    }

    const decodedConvertedTimeRange = decodeValidTimeRange(convertedTimeRange);
    if(decodedConvertedTimeRange === null) {
      return {statusCode: 400, message: 'Invalid time range'};
    }

    const deleteAppointment = { 
      email: cancelAppointmentRequest.email, 
      startTime: decodedConvertedTimeRange.startTime, 
      endTime: decodedConvertedTimeRange.endTime 
    };
    return AppointmentRepository.deleteAppointment(deleteAppointment);
  }
}
