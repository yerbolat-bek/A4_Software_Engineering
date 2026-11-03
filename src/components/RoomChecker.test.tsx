// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import RoomChecker from "./RoomChecker";

afterEach(cleanup);

const setTimes = (start: string, end: string) => {
  fireEvent.change(screen.getByLabelText(/Start Time/), { target: { value: start } });
  fireEvent.change(screen.getByLabelText(/End Time/), { target: { value: end } });
};

describe("RoomChecker UI", () => {
  it("lists all rooms initially", () => {
    render(<RoomChecker />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("F2 via UI: selecting Projector + Microphone leaves two rooms", () => {
    render(<RoomChecker />);
    fireEvent.click(screen.getByLabelText("Projector"));
    fireEvent.click(screen.getByLabelText("Microphone"));
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("F4 via UI: shows an empty state when no room matches", () => {
    render(<RoomChecker />);
    fireEvent.change(screen.getByLabelText(/Attendees/), { target: { value: "81" } });
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.getByTestId("empty-state").textContent).toContain(
      "No rooms match your requirements."
    );
  });

  it("F5 via UI: switching rooms clears the result and uses the new room's bookings", () => {
    render(<RoomChecker />);

    // Seminar Hall 305 is booked 11:00-13:00 (660-780)
    fireEvent.click(screen.getByRole("radio", { name: /Seminar Hall 305/ }));
    setTimes("660", "720");
    fireEvent.click(screen.getByText("Check Availability"));
    expect(screen.getByRole("status").textContent).toContain("Unavailable");

    // Switching room must clear the old result
    fireEvent.click(screen.getByRole("radio", { name: /Room 204/ }));
    expect(screen.queryByRole("status")).toBeNull();

    // Same slot touches Room 204's booking (600-660), so it is available
    fireEvent.click(screen.getByText("Check Availability"));
    expect(screen.getByRole("status").textContent).toContain("Available");
  });
});