"use client";

import { motion } from "framer-motion";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: Category[];
  selected: string;
  onSelectAction: (id: string) => void;
}

export function CategorySidebar({ categories, selected, onSelectAction }: CategorySidebarProps) {
  return (
    <nav className="flex flex-col gap-1 pr-4">
      {categories.map((category) => {
        const isSelected = category.id === selected;
        return (
          <button
            key={category.id}
            onClick={() => onSelectAction(category.id)}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isSelected
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-lg leading-none">{category.icon}</span>
            <span className="relative z-10">{category.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
