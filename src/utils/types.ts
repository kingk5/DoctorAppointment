export type JSONValue = string | number | boolean | null | JSONObject | JSONValue[];

export type JSONObject = {
  [key: string]: JSONValue;
};

export function decodeString(value: unknown): string | null {
    if (typeof value === 'string') {
        return value;
    }
    return null;
}
export function decodeNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return value;
    }
    return null;
}
export function decodeBoolean(value: unknown): boolean | null {
    if (typeof value === 'boolean') {
      return value;
    }
    return null;
}
export function isJSON(value: unknown): value is JSONObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export type customErrorType = {
    message: string;
    statusCode: number;
}

export function decodecustomErrorType(rawInput: unknown): customErrorType | null {
    if (isJSON(rawInput)) {
        const message = decodeString(rawInput.message);
        const statusCode = decodeNumber(rawInput.statusCode);
        if (message !== null && statusCode !== null) {
            const result: customErrorType = { message, statusCode };
            return result;
        }
    }
    return null;
}

export type CreateAppointmentRequest = {
    firstName: string;
    lastName: string;
    email: string;
    timeSlot: string;
    doctorName: string;
}
export function decodeCreateAppointmentRequest(rawInput: unknown): CreateAppointmentRequest | null {
    if (isJSON(rawInput)) {
        const firstName = decodeString(rawInput.firstName);
        const lastName = decodeString(rawInput.lastName);
        const email = decodeString(rawInput.email);
        const timeSlot = decodeString(rawInput.timeSlot);
        const doctorName = decodeString(rawInput.doctorName);
        if (firstName !== null && lastName !== null && email !== null && timeSlot !== null && doctorName !== null) {
            const result: CreateAppointmentRequest = { firstName, lastName, email, timeSlot, doctorName };
            return result;
        }
    } 
    return null;
}

export type ModifyAppointmentRequest = {
    email: string;
    originalTimeSlot: string;
    newTimeSlot: string;
}

export function decodeModifyAppointmentRequest(rawInput: unknown): ModifyAppointmentRequest | null {
    if (isJSON(rawInput)) {
        const email = decodeString(rawInput.email);
        const originalTimeSlot = decodeString(rawInput.originalTimeSlot);
        const newTimeSlot = decodeString(rawInput.newTimeSlot);
        if (email !== null && originalTimeSlot !== null && newTimeSlot !== null) {
            const result: ModifyAppointmentRequest = {email, originalTimeSlot, newTimeSlot};
            return result;
        }
    }
    return null;
}

export type ModifyAppointment = {
    email: string;
    originalStartTime: string;
    originalEndTime: string;
    newStartTime: string;
    newEndTime: string;
}
export function decodeModifyAppointment(rawInput: unknown): ModifyAppointment | null {
    if (isJSON(rawInput)) {
        const email = decodeString(rawInput.email);
        const originalStartTime = decodeString(rawInput.originalStartTime);
        const originalEndTime = decodeString(rawInput.originalEndTime);
        const newStartTime = decodeString(rawInput.newStartTime);
        const newEndTime = decodeString(rawInput.newEndTime);
        if (email !== null && originalStartTime !== null && originalEndTime !== null && newStartTime !== null && newEndTime !== null) {
            const result: ModifyAppointment = {email, originalStartTime, originalEndTime, newStartTime, newEndTime};
            return result;
        }
    }
    return null;
}

export type CancelAppointmentRequest = {
    email: string;
    startTime: string;
    endTime: string;
}

export function decodeCancelAppointmentRequest(rawInput: unknown): CancelAppointmentRequest | null {
    if (isJSON(rawInput)) {
        const email = decodeString(rawInput.email);
        const startTime = decodeString(rawInput.startTime);
        const endTime = decodeString(rawInput.endTime);
        if (email !== null && startTime !== null && endTime !== null) {
            const result: CancelAppointmentRequest = {email, startTime, endTime};
            return result;
        }
    }
    return null;
}

export type ValidTimeRange = {
    startTime: string;
    endTime: string;
}

export function decodeValidTimeRange(rawInput: unknown): ValidTimeRange | null {
    if (isJSON(rawInput)) {
        const startTime = decodeString(rawInput.startTime);
        const endTime = decodeString(rawInput.endTime);
        if (startTime !== null && endTime !== null) {
            const result: ValidTimeRange = {startTime, endTime};
            return result;
        }
    }
    return null;
}