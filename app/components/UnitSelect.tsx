"use client";

import type { UnitDef } from "@/lib/types";

type UnitSelectProps = {
  units: UnitDef[];
  selected: string;
  onChangeAction: (id: string) => void;
  label: string;
};

export function UnitSelect({ units, selected, onChangeAction, label }: UnitSelectProps) {
  return (
    <label className="block w-full">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <select
        value={selected}
        onChange={(event) => onChangeAction(event.target.value)}
        className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name} ({unit.symbol})
          </option>
        ))}
      </select>
    </label>
  );
}
