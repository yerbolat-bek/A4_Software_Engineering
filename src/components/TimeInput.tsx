import { formatTime } from "@/lib/availability";
import { MINUTES_PER_DAY } from "@/lib/constants";

interface TimeInputProps {
  id: string;
  label: string;
  value: string;
  parsed: number; // NaN when the input is empty / not a number
  placeholder: string;
  onChange: (value: string) => void;
}

export default function TimeInput({
  id,
  label,
  value,
  parsed,
  placeholder,
  onChange,
}: TimeInputProps) {
  const showPreview =
    !Number.isNaN(parsed) && parsed >= 0 && parsed <= MINUTES_PER_DAY;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-1.5"
      >
        {label}
        <span className="font-normal text-slate-400 ml-1">
          (minutes after midnight)
        </span>
      </label>
      <input
        id={id}
        type="number"
        min={0}
        max={MINUTES_PER_DAY}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder={placeholder}
      />
      {showPreview && (
        <p className="text-xs text-slate-500 mt-1.5">
          ={" "}
          <span className="font-medium text-slate-600">{formatTime(parsed)}</span>
        </p>
      )}
    </div>
  );
}