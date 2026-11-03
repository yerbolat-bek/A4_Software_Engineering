import { DoorClosed } from "lucide-react";
import type { Room } from "@/lib/rooms";

interface RoomSelectorProps {
  rooms: readonly Room[];
  totalCount: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearFilters: () => void;
}

export default function RoomSelector({
  rooms,
  totalCount,
  selectedId,
  onSelect,
  onClearFilters,
}: RoomSelectorProps) {
  if (rooms.length === 0) {
    return (
      <div
        data-testid="empty-state"
        aria-live="polite"
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center"
      >
        <p className="font-semibold text-slate-700">No rooms match your requirements.</p>
        <p className="text-sm text-slate-500 mt-1">
          Try fewer attendees or fewer equipment items.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-3 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">
        Showing {rooms.length} of {totalCount} rooms
      </p>
      <div role="radiogroup" aria-label="Rooms" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {rooms.map((room) => {
          const selected = room.id === selectedId;
          return (
            <label
              key={room.id}
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="room"
                checked={selected}
                onChange={() => onSelect(room.id)}
                className="mt-1 accent-blue-600"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <DoorClosed className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800 text-sm">{room.name}</span>
                  {room.blocked && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                      Blocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{room.location}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Capacity: {room.capacity}
                  {room.equipment.length > 0 && ` · ${room.equipment.join(", ")}`}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}