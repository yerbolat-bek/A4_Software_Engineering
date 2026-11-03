import { Booking, formatTime } from "@/lib/availability";
import { MINUTES_PER_DAY } from "@/lib/constants";

interface TimelineProps {
  now: number;
  bookings: Booking[];
  proposedStart: number | null;
  proposedEnd: number | null;
  proposedColor: "available" | "unavailable" | "neutral";
}

// Fewer labels on narrow screens so they don't overlap or clip
const HOUR_MARKS_NARROW = [360, 720, 1080];
const HOUR_MARKS_WIDE = [0, 360, 720, 1080, MINUTES_PER_DAY];
const TICK_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);

const colorClasses: Record<TimelineProps["proposedColor"], string> = {
  available: "bg-emerald-400/50 border-emerald-500",
  unavailable: "bg-rose-400/40 border-rose-500 border-dashed",
  neutral: "bg-slate-400/30 border-slate-500 border-dashed",
};

export default function Timeline({
  now,
  bookings,
  proposedStart,
  proposedEnd,
  proposedColor,
}: TimelineProps) {
  const toPercent = (minutes: number) => (minutes / MINUTES_PER_DAY) * 100;

  const showProposed =
    proposedStart !== null &&
    proposedEnd !== null &&
    !Number.isNaN(proposedStart) &&
    !Number.isNaN(proposedEnd) &&
    proposedStart >= 0 &&
    proposedEnd <= MINUTES_PER_DAY &&
    proposedStart < proposedEnd;

  return (
    <div className="w-full">
      <div className="relative h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
        {/* Tick marks */}
        {TICK_MARKS.map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-slate-200/70"
            style={{ left: `${toPercent(mark)}%` }}
          />
        ))}

        {/* Existing bookings */}
        {bookings.map((booking, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 bg-blue-400/80 border-x border-blue-500 flex items-center justify-center"
            style={{
              left: `${toPercent(booking.start)}%`,
              width: `${toPercent(booking.end - booking.start)}%`,
            }}
            title={`Booked: ${formatTime(booking.start)} \u2013 ${formatTime(booking.end)}`}
          >
            <span className="text-[10px] font-medium text-white truncate px-1 hidden sm:block">
              {formatTime(booking.start)}
            </span>
            <span className="text-[10px] font-medium text-white truncate px-0.5 sm:hidden">
              {formatTime(booking.start).replace(/:00/, "")}
            </span>
          </div>
        ))}

        {/* Now marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
          style={{ left: `${toPercent(now)}%` }}
          title={`Now: ${formatTime(now)}`}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>

        {/* Proposed booking */}
        {showProposed && (
          <div
            className={`absolute top-0 bottom-0 border-2 rounded transition-all duration-300 ${colorClasses[proposedColor]}`}
            style={{
              left: `${toPercent(proposedStart!)}%`,
              width: `${toPercent(proposedEnd! - proposedStart!)}%`,
            }}
            title={`Proposed: ${formatTime(proposedStart!)} \u2013 ${formatTime(proposedEnd!)}`}
          />
        )}
      </div>

      {/* Hour labels */}
      <div className="relative mt-1.5 h-5">
        {/* Narrow: fewer marks, smaller text, no edge labels to avoid clipping */}
        {HOUR_MARKS_NARROW.map((mark) => (
          <div
            key={mark}
            className="absolute text-[9px] sm:text-[10px] text-slate-400 font-medium -translate-x-1/2 whitespace-nowrap sm:hidden"
            style={{ left: `${toPercent(mark)}%` }}
          >
            {formatTime(mark)}
          </div>
        ))}
        {/* Wide: full set of marks including edges */}
        {HOUR_MARKS_WIDE.map((mark) => (
          <div
            key={mark}
            className="absolute text-[10px] text-slate-400 font-medium -translate-x-1/2 whitespace-nowrap hidden sm:block"
            style={{ left: `${toPercent(mark)}%` }}
          >
            {formatTime(mark)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-400/80 border border-blue-500" />
          <span>Existing booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-400/30 border border-slate-500 border-dashed" />
          <span>Proposed slot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3 bg-rose-500" />
          <span>Now ({formatTime(now)})</span>
        </div>
      </div>
    </div>
  );
}
