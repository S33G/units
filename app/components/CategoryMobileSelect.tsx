"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryMobileSelectProps {
  categories: Category[];
  selected: string;
  onSelectAction: (id: string) => void;
}

export function CategoryMobileSelect({ categories, selected, onSelectAction }: CategoryMobileSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedCategory = categories.find((c) => c.id === selected) || categories[0];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sortedCategories = categories;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left shadow-sm active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:active:bg-zinc-900"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{selectedCategory.icon}</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedCategory.name}</span>
        </span>
        <ChevronDown className="h-5 w-5 text-zinc-400" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-50 flex flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Select Category</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <Command className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center border-b border-zinc-100 px-3 dark:border-zinc-800">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Command.Input
                    placeholder="Search categories..."
                    className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100"
                  />
                </div>
                <Command.List className="flex-1 overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-zinc-500">No category found.</Command.Empty>
                  {sortedCategories.map((category) => (
                    <Command.Item
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        onSelectAction(category.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-sm outline-none transition-colors aria-selected:bg-zinc-100 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-100",
                        selected === category.id ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <span className="mr-3 text-xl">{category.icon}</span>
                      <span className="flex-1 text-base">{category.name}</span>
                      {selected === category.id && <Check className="ml-auto h-5 w-5 text-zinc-900 dark:text-zinc-100" />}
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
