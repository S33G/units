import type { Category } from "@/lib/types";

export const fuelEconomy: Category = {
  id: "fuel-economy",
  name: "Fuel Economy",
  icon: "⛽",
  baseUnitId: "km-per-liter",
  units: [
    {
      id: "km-per-liter",
      name: "Kilometres per Litre",
      symbol: "km/L",
      factor: 1,
      precision: "exact",
      formulaToBase: "value × 1",
      source: "Category base unit",
    },
    {
      id: "liters-per-100km",
      name: "Litres per 100 Kilometres",
      symbol: "L/100 km",
      toBase: (value) => 100 / value,
      fromBase: (value) => 100 / value,
      precision: "exact",
      formulaToBase: "100 ÷ value",
      source: "Fuel economy inverse definition",
    },
    {
      id: "mpg-us",
      name: "Miles per Gallon (US)",
      symbol: "mpg (US)",
      factor: 0.425144,
      precision: "approximate",
      formulaToBase: "value × 0.425144",
      source: "US gallon and international mile conversion",
    },
    {
      id: "mpg-imperial",
      name: "Miles per Gallon (Imperial)",
      symbol: "mpg (Imp)",
      factor: 0.354006,
      precision: "approximate",
      formulaToBase: "value × 0.354006",
      source: "Imperial gallon and international mile conversion",
    },
  ],
};
