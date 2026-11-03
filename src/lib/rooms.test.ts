import { describe, it, expect } from "vitest";
import { ROOMS, toAvailabilityData } from "./rooms";
import { FIXED_NOW } from "./constants";

describe("room catalog", () => {
  it("contains at least four rooms", () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
  });

  it("gives every room all required fields", () => {
    for (const r of ROOMS) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.capacity).toBeGreaterThan(0);
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe("boolean");
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });

  it("uses unique room ids", () => {
    expect(new Set(ROOMS.map((r) => r.id)).size).toBe(ROOMS.length);
  });

  it("maps a room to availability data using its own bookings", () => {
    const room = ROOMS.find((r) => r.id === "l101")!;
    const data = toAvailabilityData(room);
    expect(data.bookings).toEqual(room.bookings);
    expect(data.roomBlocked).toBe(room.blocked);
    expect(data.now).toBe(FIXED_NOW);
  });
});