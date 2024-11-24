import { Appointment } from "../models/appointment";
import { canMettingBeScheduled } from "../utils/appointment";
import { compareTime } from "../utils/dateUtils";
import { CancelAppointmentRequest, customErrorType, ModifyAppointment, ModifyAppointmentRequest } from "../utils/types";

const appointments = new Map<string, Appointment[]>();
  
// Appointment Repository
export class AppointmentRepository {
  // Fetch all appointments
  public static getAllAppointments(): Appointment[] {
    return Array.from(appointments.values()).flat();
  }

  // Find appointment by patient email
  public static getAppointmentByPatientEmail(email: string): Appointment[] {
    return Array.from(appointments.values()).flat().filter(appointment => appointment.patient.email === email);
  }

  // Find appointments by doctor's name
  public static getAppointmentsByDoctor(doctorName: string): Appointment[] {
    return appointments.has(doctorName) ? appointments.get(doctorName)! : [];
  }

  // Add new appointment
  public static addAppointment(appointment: Appointment): Appointment | customErrorType {
      const appointmentsByDoctor = AppointmentRepository.getAppointmentsByDoctor(appointment.doctorName);
      for (const existingAppointment of appointmentsByDoctor) {
        if (!canMettingBeScheduled(appointment, existingAppointment)) {
          return { message: 'Time slot is already booked', statusCode: 409 };
        }
      }
      appointmentsByDoctor.push(appointment);
      appointmentsByDoctor.sort((a, b) => a.endTime.localeCompare(b.endTime));
      appointments.set(appointment.doctorName, appointmentsByDoctor);
      return appointment;
  }

  // Delete appointment by patient email and time slot
  public static deleteAppointment(cancelAppointmentRequest: CancelAppointmentRequest): Boolean | customErrorType {
    const { email, startTime, endTime } = cancelAppointmentRequest;
    let appointmentFound = false;
  
    for (const [doctorName, doctorAppointments] of appointments.entries()) {
      const index = doctorAppointments.findIndex(
        appointment => appointment.patient.email === email && appointment.startTime === startTime && appointment.endTime === endTime
      );
  
      if (index !== -1) {
        doctorAppointments.splice(index, 1);
        appointmentFound = true;
        // Update the appointments map
        appointments.set(doctorName, doctorAppointments);
      }
    }
  
    if (appointmentFound) {
      return true;
    } else {
      return { message: 'Appointment not found', statusCode: 404 };
    }
  }

  // Modify existing appointment time slot
  public static modifyAppointment(modifyAppointment: ModifyAppointment): Appointment | customErrorType {
    const appointment = Array.from(appointments.values()).flat().find(
      appointment => appointment.patient.email === modifyAppointment.email && appointment.startTime === modifyAppointment.originalStartTime && appointment.endTime === modifyAppointment.originalEndTime
    );
    if (appointment !== undefined) {
      const newAppointment = { ...appointment, startTime: modifyAppointment.newStartTime, endTime: modifyAppointment.newEndTime };
      if (canMettingBeScheduled(newAppointment,appointment)){
        appointment.startTime = newAppointment.startTime;
        appointment.endTime = newAppointment.endTime;
        appointments.get(appointment.doctorName)!.sort((a, b) => a.endTime.localeCompare(b.endTime));
        return appointment;
      }else{
        return {statusCode: 409, message: `Can't modify time slot is already booked`};
      }
    }
    return {statusCode: 404, message: 'Appointment not found'};
  }
}
