import { describe, expect, it } from "vitest";

import { categories } from "@/lib/categories";
import { convert } from "@/lib/convert";

describe("categories", () => {
  describe("structure validation", () => {
    it("exports an array of categories", () => {
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it("each category has required fields", () => {
      categories.forEach((category) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("icon");
        expect(category).toHaveProperty("baseUnitId");
        expect(category).toHaveProperty("units");

        expect(typeof category.id).toBe("string");
        expect(typeof category.name).toBe("string");
        expect(typeof category.icon).toBe("string");
        expect(typeof category.baseUnitId).toBe("string");
        expect(Array.isArray(category.units)).toBe(true);
      });
    });

    it("each category has unique id", () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("each category has a valid base unit", () => {
      categories.forEach((category) => {
        const baseUnit = category.units.find((u) => u.id === category.baseUnitId);
        expect(baseUnit).toBeDefined();
      });
    });

    it("each category has at least one unit", () => {
      categories.forEach((category) => {
        expect(category.units.length).toBeGreaterThan(0);
      });
    });
  });

  describe("unit validation", () => {
    it("each unit has required fields", () => {
      categories.forEach((category) => {
        category.units.forEach((unit) => {
          expect(unit).toHaveProperty("id");
          expect(unit).toHaveProperty("name");
          expect(unit).toHaveProperty("symbol");
          expect(unit).toHaveProperty("precision");
          expect(unit).toHaveProperty("formulaToBase");
          expect(unit).toHaveProperty("source");

          expect(typeof unit.id).toBe("string");
          expect(typeof unit.name).toBe("string");
          expect(typeof unit.symbol).toBe("string");
          expect(["exact", "approximate"]).toContain(unit.precision);
          expect(typeof unit.formulaToBase).toBe("string");
          expect(typeof unit.source).toBe("string");
        });
      });
    });

    it("each unit has either factor or toBase/fromBase", () => {
      categories.forEach((category) => {
        category.units.forEach((unit) => {
          const hasFactor = unit.factor !== undefined;
          const hasCustom = unit.toBase !== undefined && unit.fromBase !== undefined;

          expect(hasFactor || hasCustom).toBe(true);
        });
      });
    });

    it("each unit in a category has unique id", () => {
      categories.forEach((category) => {
        const ids = category.units.map((u) => u.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });
    });

    it("base unit has factor of 1 or identity functions", () => {
      categories.forEach((category) => {
        const baseUnit = category.units.find((u) => u.id === category.baseUnitId)!;

        if (baseUnit.factor !== undefined) {
          expect(baseUnit.factor).toBe(1);
        } else {
          expect(baseUnit.toBase!(100)).toBe(100);
          expect(baseUnit.fromBase!(100)).toBe(100);
        }
      });
    });
  });

  describe("conversion accuracy", () => {
    describe("length conversions", () => {
      const length = categories.find((c) => c.id === "length")!;
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;
      const miles = length.units.find((u) => u.id === "miles")!;
      const km = length.units.find((u) => u.id === "kilometers")!;

      it("1 mile = 1.609344 km (exact)", () => {
        const result = convert(1, miles, km, length);
        expect(result.outputValue).toBe(1.609344);
      });

      it("1 foot = 0.3048 metres (exact)", () => {
        const result = convert(1, feet, meters, length);
        expect(result.outputValue).toBe(0.3048);
      });
    });

    describe("temperature conversions", () => {
      const temp = categories.find((c) => c.id === "temperature")!;
      const celsius = temp.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temp.units.find((u) => u.id === "fahrenheit")!;
      const kelvin = temp.units.find((u) => u.id === "kelvin")!;

      it("0°C = 32°F", () => {
        const result = convert(0, celsius, fahrenheit, temp);
        expect(result.outputValue).toBeCloseTo(32, 6);
      });

      it("100°C = 212°F", () => {
        const result = convert(100, celsius, fahrenheit, temp);
        expect(result.outputValue).toBeCloseTo(212, 6);
      });

      it("0°C = 273.15K", () => {
        const result = convert(0, celsius, kelvin, temp);
        expect(result.outputValue).toBeCloseTo(273.15, 6);
      });

       it("-40°C = -40°F", () => {
         const result = convert(-40, celsius, fahrenheit, temp);
         expect(result.outputValue).toBeCloseTo(-40, 6);
       });

       it("0°Ré = 0°C = 273.15K", () => {
         const reaumur = temp.units.find((u) => u.id === "reaumur")!;
         const result = convert(0, reaumur, kelvin, temp);
         expect(result.outputValue).toBeCloseTo(273.15, 6);
       });

       it("80°Ré = 100°C = 373.15K", () => {
         const reaumur = temp.units.find((u) => u.id === "reaumur")!;
         const result = convert(80, reaumur, kelvin, temp);
         expect(result.outputValue).toBeCloseTo(373.15, 6);
       });

       it("0°De = 100°C = 373.15K", () => {
         const delisle = temp.units.find((u) => u.id === "delisle")!;
         const result = convert(0, delisle, kelvin, temp);
         expect(result.outputValue).toBeCloseTo(373.15, 6);
       });

       it("150°De = 0°C = 273.15K", () => {
         const delisle = temp.units.find((u) => u.id === "delisle")!;
         const result = convert(150, delisle, kelvin, temp);
         expect(result.outputValue).toBeCloseTo(273.15, 6);
       });
     });

    describe("mass conversions", () => {
      const mass = categories.find((c) => c.id === "mass")!;
      if (mass) {
        const kg = mass.units.find((u) => u.id === "kilograms")!;
        const lb = mass.units.find((u) => u.id === "pounds")!;

        it("1 kg = ~2.20462 lbs", () => {
          const result = convert(1, kg, lb, mass);
          expect(result.outputValue).toBeCloseTo(2.20462, 4);
        });
      }
    });

    describe("volume conversions", () => {
      const volume = categories.find((c) => c.id === "volume")!;
      if (volume) {
        const liters = volume.units.find((u) => u.id === "liters")!;
        const gallons = volume.units.find((u) => u.name.includes("Gallon"))!;

        it("converts litres to gallons", () => {
          const result = convert(1, liters, gallons, volume);
          expect(result.outputValue).toBeGreaterThan(0);
        });
      }
    });
  });

  describe("round-trip conversions", () => {
    it("A → B → A returns original value (linear)", () => {
      const length = categories.find((c) => c.id === "length")!;
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;

      const original = 42.5;
      const forward = convert(original, meters, feet, length);
      const back = convert(forward.outputValue, feet, meters, length);

      expect(back.outputValue).toBeCloseTo(original, 10);
    });

    it("A → B → A returns original value (non-linear)", () => {
      const temp = categories.find((c) => c.id === "temperature")!;
      const celsius = temp.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temp.units.find((u) => u.id === "fahrenheit")!;

      const original = 25;
      const forward = convert(original, celsius, fahrenheit, temp);
      const back = convert(forward.outputValue, fahrenheit, celsius, temp);

      expect(back.outputValue).toBeCloseTo(original, 10);
    });

    it("all categories support round-trip conversion", () => {
      categories.forEach((category) => {
        if (category.units.length < 2) return;

        const unitA = category.units[0];
        const unitB = category.units[1];
        const original = 100;

        const forward = convert(original, unitA, unitB, category);
        const back = convert(forward.outputValue, unitB, unitA, category);

        expect(back.outputValue).toBeCloseTo(original, 8);
      });
    });
  });

  describe("specific category tests", () => {
    it("length category exists with expected units", () => {
      const length = categories.find((c) => c.id === "length");
      expect(length).toBeDefined();
      expect(length!.baseUnitId).toBe("meters");
      expect(length!.units.length).toBeGreaterThan(5);
    });

    it("temperature category exists with expected units", () => {
      const temp = categories.find((c) => c.id === "temperature");
      expect(temp).toBeDefined();
      expect(temp!.baseUnitId).toBe("kelvin");
      expect(temp!.units.map((u) => u.id)).toContain("celsius");
      expect(temp!.units.map((u) => u.id)).toContain("fahrenheit");
    });

    it("digital-storage category exists", () => {
      const storage = categories.find((c) => c.id === "digital-storage");
      expect(storage).toBeDefined();
    });

    it("speed category exists", () => {
      const speed = categories.find((c) => c.id === "speed");
      expect(speed).toBeDefined();
    });
  });

  describe("factor consistency", () => {
    it("factors are positive numbers for linear units", () => {
      categories.forEach((category) => {
        category.units.forEach((unit) => {
          if (unit.factor !== undefined) {
            expect(unit.factor).toBeGreaterThan(0);
            expect(Number.isFinite(unit.factor)).toBe(true);
          }
        });
      });
    });

    it("base unit factor is exactly 1 (not floating point approximation)", () => {
      categories.forEach((category) => {
        const baseUnit = category.units.find((u) => u.id === category.baseUnitId)!;
        if (baseUnit.factor !== undefined) {
          expect(baseUnit.factor).toBe(1);
        }
      });
    });
  });
});
