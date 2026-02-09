import type { Category } from "@/lib/types";

export const flowRate: Category = {
  id: "flow-rate",
  name: "Flow Rate",
  icon: "🚿",
  baseUnitId: "liters-per-minute",
  units: [
    {
      id: "liters-per-minute",
      name: "Litres per Minute",
      symbol: "L/min",
      factor: 1,
      precision: "exact",
      formulaToBase: "value × 1",
      source: "Category base unit",
    },
    {
      id: "liters-per-hour",
      name: "Litres per Hour",
      symbol: "L/h",
      factor: 1 / 60,
      precision: "exact",
      formulaToBase: "value × 1/60",
      source: "By definition: 1 h = 60 min",
    },
    {
      id: "cubic-meters-per-hour",
      name: "Cubic Metres per Hour",
      symbol: "m³/h",
      factor: 1000 / 60,
      precision: "exact",
      formulaToBase: "value × 1000/60",
      source: "SI volume and hour definitions",
    },
    {
      id: "us-gallons-per-minute",
      name: "US Gallons per Minute",
      symbol: "GPM (US)",
      factor: 3.785411784,
      precision: "exact",
      formulaToBase: "value × 3.785411784",
      source: "US gallon definition",
    },
  ],
};
