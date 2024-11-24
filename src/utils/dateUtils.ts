import { customErrorType, ValidTimeRange } from "./types";

function convertTo24HourFormat(timeStr: string): string {
  const [time, modifier] = timeStr.trim().split(' ');

  // Split time into hours and minutes
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12; // Convert PM time
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0; // Handle midnight case
  }

  // Ensure two-digit format
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
  
export function validateAndConvertTimeRange(input: string): ValidTimeRange | customErrorType{
  // Regular expression to match the time range pattern "HH:MM AM/PM - HH:MM AM/PM"
  const timeRangePattern = /^(\d{1,2}:\d{2} [APM]{2}) - (\d{1,2}:\d{2} [APM]{2})$/;

  // Match input with the pattern
  const match = input.match(timeRangePattern);

  if (!match) {
    return {statusCode: 400, message: 'Invalid time range format. Please provide the time range in the format "HH:MM AM/PM - HH:MM AM/PM".'};
  }

  const [_, startTimeStr, endTimeStr] = match;

  try {
    // Convert the start and end times to 24-hour format
    const startTime24 = convertTo24HourFormat(startTimeStr);
    const endTime24 = convertTo24HourFormat(endTimeStr);

    // Validate that the start time is before the end time
    const [startHours, startMinutes] = startTime24.split(':').map(Number);
    const [endHours, endMinutes] = endTime24.split(':').map(Number);

    if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
      return {statusCode: 400, message: 'Invalid time range. The start time must be before the end time.'};
    }

    return {
      startTime: startTime24,
      endTime: endTime24,
    };
  } catch (error) {
    return {statusCode: 400, message: 'Invalid time range format. Please provide the time range in the format "HH:MM AM/PM - HH:MM AM/PM".'};
  }
}

export function compareTime(time1: string, time2: string): number{
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  if (hours1 < hours2 || (hours1 === hours2 && minutes1 < minutes2)) {
    return -1;
  } else if (hours1 > hours2 || (hours1 === hours2 && minutes1 > minutes2)) {
    return 1;
  } else {
    return 0;
  }
}
