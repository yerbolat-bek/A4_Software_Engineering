import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  AvailabilityResult,
  formatTime,
  formatDuration,
} from "@/lib/availability";

interface ResultPanelProps {
  result: AvailabilityResult;
  roomName: string;
  start: number;
  end: number;
  duration: number;
}

export default function ResultPanel({
  result,
  roomName,
  start,
  end,
  duration,
}: ResultPanelProps) {
  return (
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
                {roomName} is available from {formatTime(start)} to{" "}
                {formatTime(end)} ({formatDuration(duration)}).
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
              <p className="text-sm text-rose-700 mt-0.5">{result.reason}</p>
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
  );
}