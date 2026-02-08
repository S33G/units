"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { categories } from "@/lib/categories";
import { convert } from "@/lib/convert";
import type { Category, ConversionResult } from "@/lib/types";
import { loadConverterState, saveConverterState } from "@/lib/storage";

import { CategorySidebar } from "@/app/components/CategorySidebar";
import { CategoryMobileSelect } from "@/app/components/CategoryMobileSelect";
import { ShareButton } from "@/app/components/ShareButton";
import { ConversionDisplay } from "@/app/components/ConversionDisplay";
import { FormulaExplainer } from "@/app/components/FormulaExplainer";
import { SwapButton } from "@/app/components/SwapButton";
import { UnitSelect } from "@/app/components/UnitSelect";

function resolveCategory(id: string | null): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}

function resolveUnitId(category: Category, id: string | null, fallbackIndex: number): string {
  if (id && category.units.some((u) => u.id === id)) return id;
  return category.units[fallbackIndex]?.id ?? category.units[0].id;
}

function initializeState(searchParams: URLSearchParams) {
  const hasUrlParams = searchParams.get("c") || searchParams.get("from") || searchParams.get("to") || searchParams.get("v");
  
  if (hasUrlParams) {
    const initialCategory = resolveCategory(searchParams.get("c"));
    return {
      categoryId: initialCategory.id,
      fromUnitId: resolveUnitId(initialCategory, searchParams.get("from"), 0),
      toUnitId: resolveUnitId(initialCategory, searchParams.get("to"), 1),
      inputValue: searchParams.get("v") ?? "",
    };
  }

  const stored = loadConverterState();
  if (stored) {
    const cat = resolveCategory(stored.categoryId);
    return {
      categoryId: cat.id,
      fromUnitId: resolveUnitId(cat, stored.fromUnitId, 0),
      toUnitId: resolveUnitId(cat, stored.toUnitId, 1),
      inputValue: stored.inputValue,
    };
  }

  const defaultCategory = categories[0];
  return {
    categoryId: defaultCategory.id,
    fromUnitId: defaultCategory.units[0]?.id ?? "",
    toUnitId: defaultCategory.units[1]?.id ?? defaultCategory.units[0]?.id ?? "",
    inputValue: "",
  };
}

export function Converter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const initialState = useMemo(() => initializeState(searchParams), [searchParams]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialState.categoryId);
  const [fromUnitId, setFromUnitId] = useState(initialState.fromUnitId);
  const [toUnitId, setToUnitId] = useState(initialState.toUnitId);
  const [inputValue, setInputValue] = useState(initialState.inputValue);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) ?? categories[0],
    [selectedCategoryId],
  );

  const validFromId = useMemo(
    () => resolveUnitId(selectedCategory, fromUnitId, 0),
    [selectedCategory, fromUnitId],
  );
  const validToId = useMemo(
    () => resolveUnitId(selectedCategory, toUnitId, 1),
    [selectedCategory, toUnitId],
  );

  const fromUnit = selectedCategory.units.find((u) => u.id === validFromId) ?? selectedCategory.units[0];
  const toUnit = selectedCategory.units.find((u) => u.id === validToId) ?? selectedCategory.units[1] ?? selectedCategory.units[0];

  useEffect(() => {
    saveConverterState({
      categoryId: selectedCategoryId,
      fromUnitId: validFromId,
      toUnitId: validToId,
      inputValue,
    });
  }, [selectedCategoryId, validFromId, validToId, inputValue]);

  const result: ConversionResult | null = useMemo(() => {
    const parsed = Number(inputValue);
    if (!inputValue.trim() || Number.isNaN(parsed) || !Number.isFinite(parsed)) return null;
    return convert(parsed, fromUnit, toUnit, selectedCategory);
  }, [fromUnit, inputValue, selectedCategory, toUnit]);

  const syncUrl = useCallback(
    (catId: string, from: string, to: string, val: string) => {
      const params = new URLSearchParams();
      params.set("c", catId);
      params.set("from", from);
      params.set("to", to);
      if (val) params.set("v", val);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, startTransition],
  );

  function handleCategoryChange(id: string) {
    const cat = resolveCategory(id);
    const newFrom = cat.units[0]?.id ?? "";
    const newTo = cat.units[1]?.id ?? cat.units[0]?.id ?? "";
    setSelectedCategoryId(cat.id);
    setFromUnitId(newFrom);
    setToUnitId(newTo);
    syncUrl(cat.id, newFrom, newTo, inputValue);
  }

  function handleFromChange(id: string) {
    setFromUnitId(id);
    syncUrl(selectedCategoryId, id, validToId, inputValue);
  }

  function handleToChange(id: string) {
    setToUnitId(id);
    syncUrl(selectedCategoryId, validFromId, id, inputValue);
  }

  function handleInputChange(val: string) {
    setInputValue(val);
    syncUrl(selectedCategoryId, validFromId, validToId, val);
  }

  function handleSwap() {
    setFromUnitId(validToId);
    setToUnitId(validFromId);
    syncUrl(selectedCategoryId, validToId, validFromId, inputValue);
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
          <CategorySidebar
            categories={sortedCategories}
            selected={selectedCategoryId}
            onSelectAction={handleCategoryChange}
          />
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <div className="md:hidden">
          <CategoryMobileSelect
            categories={sortedCategories}
            selected={selectedCategoryId}
            onSelectAction={handleCategoryChange}
          />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Convert</h3>
            <ShareButton />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Value
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter a number"
              className="w-full rounded-lg border border-zinc-200 p-3 font-mono text-2xl text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              aria-label="Value to convert"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <UnitSelect units={selectedCategory.units} selected={validFromId} onChangeAction={handleFromChange} label="From" />
            <div className="flex justify-center sm:pb-0.5">
              <SwapButton onSwapAction={handleSwap} />
            </div>
            <UnitSelect units={selectedCategory.units} selected={validToId} onChangeAction={handleToChange} label="To" />
          </div>
        </div>

        <ConversionDisplay result={result} />
        <FormulaExplainer result={result} />
      </div>
    </div>
  );
}
