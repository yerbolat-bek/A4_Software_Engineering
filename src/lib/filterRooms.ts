import type { Equipment, Room } from "./rooms";

export interface RoomFilter {
  attendees: number;
  requiredEquipment: readonly Equipment[];
}

/**
 * F1: capacity >= attendees (empty / invalid / <= 0 attendees = no capacity constraint)
 * F2: room must contain ALL required equipment items
 * Blocked rooms stay in the list (shown as "Blocked"); F3 is enforced by checkAvailability.
 */
export function filterRooms(
  rooms: readonly Room[],
  filter: RoomFilter
): Room[] {
  const needed =
    Number.isFinite(filter.attendees) && filter.attendees > 0
      ? filter.attendees
      : 0;
  return rooms.filter(
    (room) =>
      room.capacity >= needed &&
      filter.requiredEquipment.every((item) => room.equipment.includes(item))
  );
}