import type { Category } from "@/lib/types";

export const illuminance: Category = {
  id: "illuminance",
  name: "Illuminance",
  icon: "💡",
  baseUnitId: "lux",
  units: [
    {
      id: "lux",
      name: "Lux",
      symbol: "lx",
      factor: 1,
      precision: "exact",
      formulaToBase: "value × 1",
      source: "SI derived unit",
    },
    {
      id: "kilolux",
      name: "Kilolux",
      symbol: "klx",
      factor: 1000,
      precision: "exact",
      formulaToBase: "value × 1000",
      source: "SI definition (kilo prefix)",
    },
    {
      id: "foot-candles",
      name: "Foot-candles",
      symbol: "fc",
      factor: 10.7639104167,
      precision: "exact",
      formulaToBase: "value × 10.7639104167",
      source: "1 fc = 1 lm/ft², international foot definition",
    },
    {
      id: "phot",
      name: "Phot",
      symbol: "ph",
      factor: 10000,
      precision: "exact",
      formulaToBase: "value × 10000",
      source: "CGS system: 1 phot = 10,000 lux",
    },
  ],
};
