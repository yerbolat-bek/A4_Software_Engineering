import { EQUIPMENT, type Equipment } from "@/lib/rooms";

interface RoomFiltersProps {
  attendees: string;
  onAttendeesChange: (value: string) => void;
  selectedEquipment: readonly Equipment[];
  onToggleEquipment: (item: Equipment) => void;
}

export default function RoomFilters({
  attendees,
  onAttendeesChange,
  selectedEquipment,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="attendees"
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          Attendees
          <span className="font-normal text-slate-400 ml-1">(optional)</span>
        </label>
        <input
          id="attendees"
          type="number"
          min={1}
          value={attendees}
          onChange={(e) => onAttendeesChange(e.target.value)}
          placeholder="e.g. 20"
          className="w-full sm:w-40 px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-slate-700 mb-1.5">
          Required equipment
        </legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((item) => (
            <label
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedEquipment.includes(item)}
                onChange={() => onToggleEquipment(item)}
                className="accent-blue-600"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}