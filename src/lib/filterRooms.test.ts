import { describe, it, expect } from "vitest";
import { filterRooms } from "./filterRooms";
import { ROOMS, toAvailabilityData } from "./rooms";
import { checkAvailability } from "./availability";

const ids = (rooms: { id: string }[]) => rooms.map((r) => r.id);
const room = (id: string) => ROOMS.find((r) => r.id === id)!;

describe("F1: capacity filter", () => {
  it("includes a room with exactly the requested capacity (8)", () => {
    const result = filterRooms(ROOMS, { attendees: 8, requiredEquipment: [] });
    expect(ids(result)).toContain("m012");
  });

  it("excludes a room with insufficient capacity (9 > 8)", () => {
    const result = filterRooms(ROOMS, { attendees: 9, requiredEquipment: [] });
    expect(ids(result)).not.toContain("m012");
    expect(ids(result)).toContain("t410");
  });

  it("treats empty or invalid attendees as no capacity constraint", () => {
    expect(filterRooms(ROOMS, { attendees: NaN, requiredEquipment: [] })).toHaveLength(ROOMS.length);
    expect(filterRooms(ROOMS, { attendees: 0, requiredEquipment: [] })).toHaveLength(ROOMS.length);
  });
});

describe("F2: equipment filter", () => {
  it("requires ALL selected items", () => {
    const result = filterRooms(ROOMS, {
      attendees: 0,
      requiredEquipment: ["Projector", "Microphone"],
    });
    expect(ids(result)).toEqual(["s305", "t410"]);
  });

  it("excludes rooms missing even one required item", () => {
    const result = filterRooms(ROOMS, {
      attendees: 0,
      requiredEquipment: ["Projector", "Whiteboard"],
    });
    expect(ids(result)).toEqual(["r204", "t410"]);
    expect(ids(result)).not.toContain("l101"); // has Projector but no Whiteboard
  });

  it("combines capacity and equipment filters", () => {
    const result = filterRooms(ROOMS, {
      attendees: 20,
      requiredEquipment: ["Projector"],
    });
    expect(ids(result)).toEqual(["r204", "l101", "s305"]);
  });
});

describe("F3: blocked room", () => {
  it("is never reported as available, even for an otherwise valid slot", () => {
    const blocked = room("t410");
    const result = checkAvailability(800, 860, toAvailabilityData(blocked));
    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") expect(result.reason).toMatch(/blocked/i);
  });
});

describe("F4: empty state", () => {
  it("returns an empty list when no room matches (capacity)", () => {
    expect(filterRooms(ROOMS, { attendees: 81, requiredEquipment: [] })).toEqual([]);
  });

  it("returns an empty list when no room matches (equipment)", () => {
    expect(
      filterRooms(ROOMS, {
        attendees: 0,
        requiredEquipment: ["Video Conferencing", "Computers"],
      })
    ).toEqual([]);
  });
});

describe("F5 (logic level): availability depends on the chosen room", () => {
  it("same slot gives different results for different rooms", () => {
    // 10:00-11:00 overlaps Room 204's booking but not Meeting Room 012
    expect(checkAvailability(600, 660, toAvailabilityData(room("r204"))).status).toBe("unavailable");
    expect(checkAvailability(600, 660, toAvailabilityData(room("m012"))).status).toBe("available");
  });

  it("does not use another room's bookings", () => {
    // 11:00-12:00 is booked in Seminar Hall 305 (660-780), but free in Room 204
    expect(checkAvailability(660, 720, toAvailabilityData(room("s305"))).status).toBe("unavailable");
    expect(checkAvailability(660, 720, toAvailabilityData(room("r204"))).status).toBe("available");
  });
});