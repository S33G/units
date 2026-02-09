import type { Category } from "@/lib/types";

export const density: Category = {
  id: "density",
  name: "Density",
  icon: "🧱",
  baseUnitId: "kilograms-per-cubic-meter",
  units: [
    {
      id: "kilograms-per-cubic-meter",
      name: "Kilograms per Cubic Metre",
      symbol: "kg/m³",
      factor: 1,
      precision: "exact",
      formulaToBase: "value × 1",
      source: "SI derived unit",
    },
    {
      id: "grams-per-cubic-centimeter",
      name: "Grams per Cubic Centimetre",
      symbol: "g/cm³",
      factor: 1000,
      precision: "exact",
      formulaToBase: "value × 1000",
      source: "SI scaling: 1 g/cm³ = 1000 kg/m³",
    },
    {
      id: "pounds-per-cubic-foot",
      name: "Pounds per Cubic Foot",
      symbol: "lb/ft³",
      factor: 16.01846337,
      precision: "approximate",
      formulaToBase: "value × 16.01846337",
      source: "From international pound and foot definitions",
    },
  ],
};
