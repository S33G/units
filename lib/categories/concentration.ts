import type { Category } from "@/lib/types";

export const concentration: Category = {
  id: "concentration",
  name: "Concentration",
  icon: "🧪",
  baseUnitId: "milligrams-per-liter",
  units: [
    {
      id: "milligrams-per-liter",
      name: "Milligrams per Liter",
      symbol: "mg/L",
      factor: 1,
      precision: "exact",
      formulaToBase: "value × 1",
      source: "Category base unit",
    },
    {
      id: "parts-per-million",
      name: "Parts per Million",
      symbol: "ppm",
      factor: 1,
      precision: "approximate",
      formulaToBase: "value × 1",
      source: "Dilute aqueous approximation: 1 ppm ≈ 1 mg/L",
    },
    {
      id: "grams-per-liter",
      name: "Grams per Liter",
      symbol: "g/L",
      factor: 1000,
      precision: "exact",
      formulaToBase: "value × 1000",
      source: "SI mass scaling",
    },
    {
      id: "percent-by-mass",
      name: "Percent by Mass",
      symbol: "% w/w",
      factor: 10000,
      precision: "approximate",
      formulaToBase: "value × 10000",
      source: "Using 1% = 10,000 ppm and dilute aqueous approximation",
    },
  ],
};
