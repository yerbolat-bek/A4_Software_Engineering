import { useState } from "react";
import { Building2, Clock, CalendarClock, DoorClosed } from "lucide-react";
import {
  AvailabilityResult,
  checkAvailability,
  formatTime,
  formatDuration,
} from "@/lib/availability";
import { MAX_BOOKING_MINUTES, FIXED_NOW } from "@/lib/constants";
import { ROOMS, toAvailabilityData, type Equipment } from "@/lib/rooms";
import { filterRooms } from "@/lib/filterRooms";
import Timeline from "@/components/Timeline";
import TimeInput from "@/components/TimeInput";
import ResultPanel from "@/components/ResultPanel";
import RoomFilters from "@/components/RoomFilters";
import RoomSelector from "@/components/RoomSelector";

const DEFAULT_START = "670";
const DEFAULT_END = "720";

function parseInput(value: string): number {
  const trimmed = value.trim();
  if (trimmed === "") return NaN;
  return Number(trimmed);
}

export default function RoomChecker() {
  const [attendeesInput, setAttendeesInput] = useState("");
  const [requiredEquipment, setRequiredEquipment] = useState<Equipment[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);
  const [startInput, setStartInput] = useState(DEFAULT_START);
  const [endInput, setEndInput] = useState(DEFAULT_END);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const filteredRooms = filterRooms(ROOMS, {
    attendees: parseInput(attendeesInput),
    requiredEquipment,
  });
  // If the selected room was filtered out, fall back to the first match (or none).
  const selectedRoom =
    filteredRooms.find((r) => r.id === selectedRoomId) ?? filteredRooms[0] ?? null;

  const startNum = parseInput(startInput);
  const endNum = parseInput(endInput);
  const duration =
    !Number.isNaN(startNum) && !Number.isNaN(endNum) ? endNum - startNum : 0;

  const proposedColor: "available" | "unavailable" | "neutral" =
    result?.status === "available"
      ? "available"
      : result?.status === "unavailable"
        ? "unavailable"
        : "neutral";

  // Every input change invalidates the previous result (F5).
  const changeAttendees = (value: string) => {
    setAttendeesInput(value);
    setResult(null);
  };
  const toggleEquipment = (item: Equipment) => {
    setRequiredEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
    setResult(null);
  };
  const clearFilters = () => {
    setAttendeesInput("");
    setRequiredEquipment([]);
    setResult(null);
  };
  const selectRoom = (id: string) => {
    setSelectedRoomId(id);
    setResult(null);
  };
  const changeStart = (value: string) => {
    setStartInput(value);
    setResult(null);
  };
  const changeEnd = (value: string) => {
    setEndInput(value);
    setResult(null);
  };

  const handleCheck = () => {
    if (!selectedRoom) return;
    setResult(checkAvailability(startNum, endNum, toAvailabilityData(selectedRoom)));
  };

  const handleReset = () => {
    setStartInput(DEFAULT_START);
    setEndInput(DEFAULT_END);
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3 shadow-lg shadow-blue-600/30">
          <Building2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Smart Campus Room Availability Checker
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
          Choose a room, then check if it is available for your requested time slot.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-7 space-y-6 border-b border-slate-100">
          <RoomFilters
            attendees={attendeesInput}
            onAttendeesChange={changeAttendees}
            selectedEquipment={requiredEquipment}
            onToggleEquipment={toggleEquipment}
          />
          <RoomSelector
            rooms={filteredRooms}
            totalCount={ROOMS.length}
            selectedId={selectedRoom?.id ?? null}
            onSelect={selectRoom}
            onClearFilters={clearFilters}
          />
        </div>

        {selectedRoom && (
          <>
            {/* Room Info Bar */}
            <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">
                      {selectedRoom.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRoom.location}</p>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Now: {formatTime(FIXED_NOW)}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                      selectedRoom.blocked
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedRoom.blocked ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                    />
                    {selectedRoom.blocked ? "Blocked" : "Open"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-6">
              {/* Existing Bookings */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    Today&rsquo;s Bookings
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.bookings.length === 0 ? (
                    <span className="text-sm text-slate-400">No existing bookings.</span>
                  ) : (
                    selectedRoom.bookings.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                      >
                        <Clock className="w-3 h-3" />
                        {formatTime(b.start)} &ndash; {formatTime(b.end)}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">
                  24-Hour Timeline
                </h2>
                <Timeline
                  now={FIXED_NOW}
                  bookings={selectedRoom.bookings}
                  proposedStart={Number.isNaN(startNum) ? null : startNum}
                  proposedEnd={Number.isNaN(endNum) ? null : endNum}
                  proposedColor={proposedColor}
                />
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TimeInput
                  id="start-time"
                  label="Start Time"
                  value={startInput}
                  parsed={startNum}
                  placeholder="e.g. 540"
                  onChange={changeStart}
                />
                <TimeInput
                  id="end-time"
                  label="End Time"
                  value={endInput}
                  parsed={endNum}
                  placeholder="e.g. 600"
                  onChange={changeEnd}
                />
              </div>

              {/* Duration Display */}
              {!Number.isNaN(startNum) && !Number.isNaN(endNum) && duration > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-sm text-slate-500">Requested Duration</span>
                  <span
                    className={`text-sm font-semibold ${
                      duration > MAX_BOOKING_MINUTES ? "text-rose-600" : "text-slate-700"
                    }`}
                  >
                    {formatDuration(duration)}
                    {duration > MAX_BOOKING_MINUTES &&
                      ` (exceeds ${MAX_BOOKING_MINUTES} min max)`}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCheck}
                  className="flex-1 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm sm:text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Check Availability
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm hover:bg-slate-200 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Reset
                </button>
              </div>

              {/* Result */}
              {result && (
                <ResultPanel
                  result={result}
                  roomName={selectedRoom.name}
                  start={startNum}
                  end={endNum}
                  duration={duration}
                />
              )}

              {/* Help text */}
              <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 space-y-1">
                <p>
                  <span className="font-medium text-slate-500">Tip:</span> Times are
                  entered as minutes after midnight. Examples: 540 = 9:00 AM, 720 =
                  12:00 PM, 1020 = 5:00 PM.
                </p>
                <p>
                  Max booking duration: {MAX_BOOKING_MINUTES} minutes. This tool only
                  checks availability &mdash; it does not create or confirm bookings.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}