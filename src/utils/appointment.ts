import { Appointment } from "../models/appointment";
import { compareTime } from "./dateUtils";

export function canMettingBeScheduled(newAppointment: Appointment, existingAppointment: Appointment) {
    if (compareTime(newAppointment.startTime, existingAppointment.startTime) >= 0 && compareTime(newAppointment.startTime, existingAppointment.endTime) <= 0) {
        return false;
    }
    if (compareTime(newAppointment.endTime, existingAppointment.startTime) >= 0 && compareTime(newAppointment.endTime, existingAppointment.endTime) <= 0) {
        return false;
    }
    return true;
}