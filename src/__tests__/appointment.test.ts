import request from "supertest";
import app from '../app';
import http from 'http';
import { CancelAppointmentRequest, ModifyAppointmentRequest } from "../utils/types";
const httpapp = http.createServer(app);
describe('server', () => {
    describe('POST /api/appointment', () => {
        it('should create a appointment', async () => {
            const response = await request(httpapp).post('/api/appointment').send({
                    firstName: 'John',
                    lastName: 'Doe',
                    timeSlot: '10:00 AM - 11:00 AM',
                    doctorName: 'Dr. John Doe',
                    email: 'khatri.prince1999@gmail.com'
                }).set('Accept', 'application/json');
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Appointment booked successfully');
        });
        it('should give 400 incorrect payload as timeslot is not provided', async () => {
            const response = await request(httpapp).post('/api/appointment').send({
                    firstName: 'John',
                    lastName: 'Doe',
                    doctorName: 'Dr. John Doe',
                    email: 'khatri.prince1999@gmail.com'
                })
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Incorrect Payload');
        });
        it('should give 409 Booking Failed', async () => {
            await request(httpapp).post('/api/appointment').send({
                firstName: 'John',//change
                lastName: 'Doe',//change
                timeSlot: '09:00 AM - 10:00 AM',
                doctorName: 'Dr. John Doe',
                email: 'khatri.prince1999@gmail.com'
            }).set('Accept', 'application/json');
            const response = await request(httpapp).post('/api/appointment').send({
                firstName: 'Prince',
                lastName: 'Khatri',
                timeSlot: '09:30 AM - 10:30 AM',
                doctorName: 'Dr. John Doe',//change
                email: 'khatri.prince1999@gmail.com'
            }).set('Accept', 'application/json');
            expect(response.statusCode).toBe(409);
            expect(response.body.error).toBe('Booking Failed');
        });
    });
    describe('GET /appointments/:email', () => {
        it('should return appointment details for the given email', async () => {
            const patientEmail = 'khatri.prince1999@gmail.com';
            await request(httpapp).post('/api/appointment').send({
                firstName: 'John',//change
                lastName: 'Doe',//change
                timeSlot: '09:00 AM - 10:00 AM',
                doctorName: 'Dr. John Doe',
                email: patientEmail
            }).set('Accept', 'application/json');
            const response = await request(httpapp).get(`/api/appointments/${patientEmail}`);
            expect(response.status).toBe(200);
        });
        it('should return 404 appointment not found', async () => {
            const patientEmail = 'khatri.prince1998@gmail.com';
            const response = await request(httpapp).get(`/api/appointments/${patientEmail}`);
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Appointment not found');
        });
    });
    describe('GET /api/appointments/doctor/:doctorName', () => {
        it('should give 200 Appointment not found', async () => {
            const doctorName = "Dr. John Doe";
            const response = await request(httpapp).get(`/api/appointments/doctor/${doctorName}`)
            expect(response.statusCode).toBe(200);
        });
        it('should give 404 with appointment', async () => {
            const doctorName = "Dr. Rahul Reddy";
            const response = await request(httpapp).get(`/api/appointments/doctor/${doctorName}`)
            expect(response.statusCode).toBe(404);
        });
    });
    describe('PUT /api/appointment', () => {
        it('should create a appointment', async () => {
            const patientEmail = 'khatri.prince1999@gmail.com';
            const modifyAppointmentRequest: ModifyAppointmentRequest = {
                email: patientEmail,
                originalTimeSlot: '10:00 AM - 11:00 AM',
                newTimeSlot: '09:00 PM - 10:00 PM'
            }
            const response = await request(httpapp).put('/api/appointment').send(modifyAppointmentRequest);
            expect(response.statusCode).toBe(200);
        });
        it('should give 400 incorrect payload', async () => {
            const response = await request(httpapp).put('/api/appointment').send({
                email: 'khatri.prince1999@gmail.com',
                originalTimeSlot: '09:00 AM - 10:00 AM',
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Incorrect Payload');
        });
        it('should give 404 Appointment not found', async () => {
            const modifyAppointmentRequest: ModifyAppointmentRequest = {
                email: 'khatri.prince@gmail.com',
                originalTimeSlot: '09:00 AM - 10:00 AM',
                newTimeSlot: '09:00 PM - 10:00 PM'
            }
            const response = await request(httpapp).put('/api/appointment').send(modifyAppointmentRequest);
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Appointment not found');
        });
    });
    describe('DELETE /api/appointment', () => {
        it('should give 200 and cancel a appointment', async () => {
            const cancelAppointmentRequest: CancelAppointmentRequest = {
                email: 'khatri.prince1999@gmail.com',
                startTime: '09:00 PM',
                endTime: '10:00 PM'
            }
            const response = await request(httpapp).delete('/api/appointment').send(cancelAppointmentRequest)
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Appointment canceled successfully');
        });
        it('should give 400 and incorrect payload', async () => {
            const response = await request(httpapp).delete('/api/appointment').send({
                email: 'khatri.prince1999@gmail.com',
                startTime: '09:00 PM',
            })
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Incorrect Payload');
        });
        it('should give 404 and Appointment not found', async () => {
            const cancelAppointmentRequest: CancelAppointmentRequest = {
                email: 'khatri.prince1999@gmail.com',
                startTime: '08:00 PM',
                endTime: '09:00 PM'
            }
            const response = await request(httpapp).delete('/api/appointment').send(cancelAppointmentRequest)
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Appointment not found');
        });
    });
    
});

