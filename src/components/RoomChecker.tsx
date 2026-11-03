import { useState } from "react";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarClock,
  DoorClosed,
} from "lucide-react";
import {
  AvailabilityData,
  AvailabilityResult,
  checkAvailability,
  formatTime,
  formatDuration,
} from "@/lib/availability";
import Timeline from "@/components/Timeline";
import { MINUTES_PER_DAY, MAX_BOOKING_MINUTES } from "@/lib/constants";

const ROOM_DATA: AvailabilityData = {
  now: 540,
  roomBlocked: false,
  bookings: [{ start: 600, end: 660 }],
};

const ROOM_NAME = "Room 204";
const ROOM_LOCATION = "Engineering Building, Floor 2";

function parseInput(value: string): number {
  const trimmed = value.trim();
  if (trimmed === "") return NaN;
  return Number(trimmed);
}

export default function RoomChecker() {
  const [startInput, setStartInput] = useState("670");
  const [endInput, setEndInput] = useState("720");
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const startNum = parseInput(startInput);
  const endNum = parseInput(endInput);
  const startValid = !Number.isNaN(startNum);
  const endValid = !Number.isNaN(endNum);
  const duration = startValid && endValid ? endNum - startNum : 0;

  const proposedStart = startValid ? startNum : null;
  const proposedEnd = endValid ? endNum : null;

  const proposedColor: "available" | "unavailable" | "neutral" =
    result?.status === "available"
      ? "available"
      : result?.status === "unavailable"
        ? "unavailable"
        : "neutral";

  const handleCheck = () => {
    setResult(checkAvailability(startNum, endNum, ROOM_DATA));
  };

  const handleReset = () => {
    setStartInput("670");
    setEndInput("720");
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
          Check if {ROOM_NAME} is available for your requested time slot.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        {/* Room Info Bar */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <DoorClosed className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800 text-sm sm:text-base">
                  {ROOM_NAME}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{ROOM_LOCATION}</p>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Now: {formatTime(ROOM_DATA.now)}</span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                  ROOM_DATA.roomBlocked
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    ROOM_DATA.roomBlocked ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                {ROOM_DATA.roomBlocked ? "Blocked" : "Open"}
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
              {ROOM_DATA.bookings.length === 0 ? (
                <span className="text-sm text-slate-400">No existing bookings.</span>
              ) : (
                ROOM_DATA.bookings.map((b, i) => (
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
              now={ROOM_DATA.now}
              bookings={ROOM_DATA.bookings}
              proposedStart={proposedStart}
              proposedEnd={proposedEnd}
              proposedColor={proposedColor}
            />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Start Time
                <span className="font-normal text-slate-400 ml-1">
                  (minutes after midnight)
                </span>
              </label>
              <input
                id="start-time"
                type="number"
                min={0}
                max={MINUTES_PER_DAY}
                value={startInput}
                onChange={(e) => {
                  setStartInput(e.target.value);
                  setResult(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="e.g. 540"
              />
              {startValid && startNum >= 0 && startNum <= MINUTES_PER_DAY && (
                <p className="text-xs text-slate-500 mt-1.5">
                  ={" "}
                  <span className="font-medium text-slate-600">
                    {formatTime(startNum)}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                End Time
                <span className="font-normal text-slate-400 ml-1">
                  (minutes after midnight)
                </span>
              </label>
              <input
                id="end-time"
                type="number"
                min={0}
                max={MINUTES_PER_DAY}
                value={endInput}
                onChange={(e) => {
                  setEndInput(e.target.value);
                  setResult(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="e.g. 600"
              />
              {endValid && endNum >= 0 && endNum <= MINUTES_PER_DAY && (
                <p className="text-xs text-slate-500 mt-1.5">
                  ={" "}
                  <span className="font-medium text-slate-600">
                    {formatTime(endNum)}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {startValid && endValid && duration > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-sm text-slate-500">Requested Duration</span>
              <span
                className={`text-sm font-semibold ${
                  duration > MAX_BOOKING_MINUTES ? "text-rose-600" : "text-slate-700"
                }`}
              >
                {formatDuration(duration)}
                {duration > MAX_BOOKING_MINUTES && ` (exceeds ${MAX_BOOKING_MINUTES} min max)`}
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
            <div
              role="status"
              aria-live="polite"
              className="animate-fade-in-up rounded-xl border p-4 sm:p-5"
            >
              {result.status === "available" && (
                <div className="bg-emerald-50 border-emerald-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-900 text-base sm:text-lg">
                        Available
                      </p>
                      <p className="text-sm text-emerald-700 mt-0.5">
                        {ROOM_NAME} is available from {formatTime(startNum)} to{" "}
                        {formatTime(endNum)} ({formatDuration(duration)}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.status === "unavailable" && (
                <div className="bg-rose-50 border-rose-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-900 text-base sm:text-lg">
                        Unavailable
                      </p>
                      <p className="text-sm text-rose-700 mt-0.5">
                        {result.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.status === "invalid" && (
                <div className="bg-amber-50 border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-bold text-amber-900 text-base sm:text-lg">
                        Please Fix the Following
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {result.errors.map((err, i) => (
                          <li
                            key={i}
                            className="text-sm text-amber-700 flex items-start gap-1.5"
                          >
                            <span className="text-amber-400 mt-0.5">&bull;</span>
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help text */}
          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 space-y-1">
            <p>
              <span className="font-medium text-slate-500">Tip:</span> Times are
              entered as minutes after midnight. Examples: 540 = 9:00 AM, 720 =
              12:00 PM, 1020 = 5:00 PM.
            </p>
            <p>
              Max booking duration: {MAX_BOOKING_MINUTES} minutes. This tool only checks
              availability &mdash; it does not create or confirm bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
