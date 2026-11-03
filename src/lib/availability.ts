import { MINUTES_PER_DAY, MAX_BOOKING_MINUTES } from "./constants";

export interface Booking {
  start: number;
  end: number;
}

export interface AvailabilityData {
  now: number;
  roomBlocked: boolean;
  bookings: Booking[];
}

export type AvailabilityResult =
  | { status: "available" }
  | { status: "unavailable"; reason: string }
  | { status: "invalid"; errors: string[] };

export function formatTime(minutes: number): string {
  if (minutes === MINUTES_PER_DAY) return "12:00 AM";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 minutes";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minute${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${h} hour${h !== 1 ? "s" : ""}`;
  return `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
}

export function checkAvailability(
  start: number,
  end: number,
  data: AvailabilityData
): AvailabilityResult {
  const errors: string[] = [];

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    errors.push("Please enter valid numbers for both start and end times.");
    return { status: "invalid", errors };
  }

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    errors.push("Start and end times must be whole numbers (integers).");
    return { status: "invalid", errors };
  }

  // AC1: 0 <= start < end <= MINUTES_PER_DAY, and start must be strictly after now
  if (start < 0) {
    errors.push("Start time cannot be earlier than 0 (midnight).");
  }
  if (end > MINUTES_PER_DAY) {
    errors.push(`End time cannot exceed ${MINUTES_PER_DAY} (end of day).`);
  }
  if (start >= end) {
    errors.push("Start time must be earlier than end time.");
  }
  if (start <= data.now) {
    errors.push(
      `Start time must be strictly after the current time (now = ${data.now}, ${formatTime(data.now)}).`
    );
  }

  // AC2: Duration must not exceed MAX_BOOKING_MINUTES (exactly the maximum is allowed)
  if (end - start > MAX_BOOKING_MINUTES) {
    errors.push(
      `Booking duration cannot exceed ${MAX_BOOKING_MINUTES} minutes. Please choose a shorter time range.`
    );
  }

  if (errors.length > 0) {
    return { status: "unavailable", reason: errors.join(" ") };
  }

  // AC3: If the room is blocked, every request is Unavailable
  if (data.roomBlocked) {
    return {
      status: "unavailable",
      reason: "This room is currently blocked and cannot be booked.",
    };
  }

  // AC4: Any overlap with an existing booking is Unavailable.
  // Touching at an endpoint is NOT an overlap.
  for (const booking of data.bookings) {
    if (start < booking.end && end > booking.start) {
      return {
        status: "unavailable",
        reason: `The requested time (${formatTime(start)}\u2013${formatTime(end)}) overlaps with an existing booking (${formatTime(booking.start)}\u2013${formatTime(booking.end)}).`,
      };
    }
  }

  // Original code labelled this "AC5: Available"; here it is the success path
  return { status: "available" };
}