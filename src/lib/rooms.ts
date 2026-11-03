import type { AvailabilityData, Booking } from "./availability";
import { FIXED_NOW } from "./constants";

export const EQUIPMENT = [
  "Projector",
  "Whiteboard",
  "Video Conferencing",
  "Computers",
  "Microphone",
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: Equipment[];
  blocked: boolean;
  bookings: Booking[];
}

// Fictional data only
export const ROOMS: Room[] = [
  {
    id: "r204",
    name: "Room 204",
    location: "Engineering Building, Floor 2",
    capacity: 30,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "l101",
    name: "Computer Lab 101",
    location: "Science Building, Floor 1",
    capacity: 24,
    equipment: ["Computers", "Projector"],
    blocked: false,
    bookings: [
      { start: 570, end: 630 },
      { start: 780, end: 840 },
    ],
  },
  {
    id: "s305",
    name: "Seminar Hall 305",
    location: "Main Building, Floor 3",
    capacity: 80,
    equipment: ["Projector", "Microphone", "Video Conferencing"],
    blocked: false,
    bookings: [{ start: 660, end: 780 }],
  },
  {
    id: "m012",
    name: "Meeting Room 012",
    location: "Library, Ground Floor",
    capacity: 8,
    equipment: ["Whiteboard", "Video Conferencing"],
    blocked: false,
    bookings: [],
  },
  {
    id: "t410",
    name: "Studio 410",
    location: "Arts Building, Floor 4",
    capacity: 15,
    equipment: ["Whiteboard", "Projector", "Microphone"],
    blocked: true,
    bookings: [],
  },
];

/** Adapts a room to the input of checkAvailability (uses ONLY this room's data). */
export function toAvailabilityData(
  room: Room,
  now: number = FIXED_NOW
): AvailabilityData {
  return { now, roomBlocked: room.blocked, bookings: room.bookings };
}