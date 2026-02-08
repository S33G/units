"use client";

import type { Category } from "@/lib/types";

type CategoryPickerProps = {
  categories: Category[];
  selected: string;
  onSelectAction: (id: string) => void;
};

export function CategoryPicker({ categories, selected, onSelectAction }: CategoryPickerProps) {
  return (
    <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {categories.map((category) => {
        const isActive = category.id === selected;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectAction(category.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950 ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
            aria-pressed={isActive}
          >
            <span aria-hidden="true">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
