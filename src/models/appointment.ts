import { Patient } from "./patient";

export interface Appointment {
  patient: Patient;
  startTime: string;
  endTime: string;
  doctorName: string;
}