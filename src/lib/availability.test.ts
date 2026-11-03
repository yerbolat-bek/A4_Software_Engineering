import { describe, it, expect } from "vitest";
import { checkAvailability, AvailabilityData } from "./availability";

const makeData = (o: Partial<AvailabilityData> = {}): AvailabilityData => ({
  now: 540,
  roomBlocked: false,
  bookings: [{ start: 600, end: 660 }],
  ...o,
});

const deepFreeze = <T>(obj: T): T => {
  Object.values(obj as object).forEach((v) => {
    if (typeof v === "object" && v !== null) deepFreeze(v);
  });
  return Object.freeze(obj);
};

describe("AC1: valid time", () => {
  it("accepts a valid future slot", () => {
    expect(checkAvailability(670, 720, makeData()).status).toBe("available");
  });

  it("rejects start equal to now (must be strictly after)", () => {
    expect(checkAvailability(540, 590, makeData()).status).toBe("unavailable");
  });

  it("accepts start = now + 1", () => {
    expect(checkAvailability(541, 600, makeData()).status).toBe("available");
  });

  it.each([
    [700, 700],
    [720, 700],
  ])("rejects start >= end (%i, %i)", (s, e) => {
    expect(checkAvailability(s, e, makeData()).status).toBe("unavailable");
  });

  it("rejects end after 1440", () => {
    expect(checkAvailability(1400, 1441, makeData()).status).toBe("unavailable");
  });

  it("accepts end exactly 1440", () => {
    expect(checkAvailability(1400, 1440, makeData()).status).toBe("available");
  });

  it("rejects negative start", () => {
    expect(checkAvailability(-10, 30, makeData()).status).toBe("unavailable");
  });

  it("reports invalid for NaN and non-integer input", () => {
    expect(checkAvailability(NaN, 700, makeData()).status).toBe("invalid");
    expect(checkAvailability(670.5, 720, makeData()).status).toBe("invalid");
  });
});

describe("AC2: 120-minute maximum", () => {
  const noBookings = makeData({ bookings: [] });

  it("accepts exactly 120 minutes", () => {
    expect(checkAvailability(700, 820, noBookings).status).toBe("available");
  });

  it("rejects 121 minutes", () => {
    const r = checkAvailability(700, 821, noBookings);
    expect(r.status).toBe("unavailable");
    if (r.status === "unavailable") expect(r.reason).toContain("120");
  });
});

describe("AC3: blocked room", () => {
  it("is unavailable even for an otherwise valid slot", () => {
    const r = checkAvailability(700, 760, makeData({ roomBlocked: true, bookings: [] }));
    expect(r.status).toBe("unavailable");
    if (r.status === "unavailable") expect(r.reason).toMatch(/blocked/i);
  });
});

describe("AC4: overlap rules", () => {
  it("touching the start of a booking is available (541-600)", () => {
    expect(checkAvailability(541, 600, makeData()).status).toBe("available");
  });

  it("touching the end of a booking is available (660-720)", () => {
    expect(checkAvailability(660, 720, makeData()).status).toBe("available");
  });

  it.each([
    ["partial overlap at the end", 650, 710],
    ["fully inside a booking", 610, 650],
    ["fully containing a booking", 580, 680],
    ["overlap by one minute at the start", 541, 601],
    ["overlap by one minute at the end", 659, 719],
  ])("%s is unavailable", (_name, s, e) => {
    expect(checkAvailability(s, e, makeData()).status).toBe("unavailable");
  });
});

describe("AC5: booking data is immutable", () => {
  it("does not modify the input data", () => {
    const data = makeData();
    const snapshot = JSON.parse(JSON.stringify(data));
    deepFreeze(data); // любая попытка записи выбросит ошибку
    checkAvailability(650, 710, data);
    checkAvailability(700, 760, data);
    expect(data).toEqual(snapshot);
  });
});