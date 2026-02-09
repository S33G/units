import { describe, expect, it } from "vitest";

import { convert, formatNum } from "@/lib/convert";
import { length } from "@/lib/categories/length";
import { temperature } from "@/lib/categories/temperature";

describe("convert", () => {
  describe("linear conversions (factor-based)", () => {
    it("converts metres to feet correctly", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;
      const result = convert(5, meters, feet, length);

      expect(result.outputValue).toBeCloseTo(16.4042, 4);
      expect(result.inputValue).toBe(5);
      expect(result.fromUnit.id).toBe("meters");
      expect(result.toUnit.id).toBe("feet");
      expect(result.category.id).toBe("length");
      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].description).toContain("Metres to Metres");
      expect(result.steps[1].description).toContain("Metres to Feet");
    });

    it("converts feet to metres correctly", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;
      const result = convert(16.4042, feet, meters, length);

      expect(result.outputValue).toBeCloseTo(5, 4);
    });

    it("converts miles to kilometres correctly", () => {
      const miles = length.units.find((u) => u.id === "miles")!;
      const km = length.units.find((u) => u.id === "kilometers")!;
      const result = convert(1, miles, km, length);

      expect(result.outputValue).toBeCloseTo(1.609344, 6);
      expect(result.steps).toHaveLength(2);
    });

    it("converts kilometres to miles correctly", () => {
      const miles = length.units.find((u) => u.id === "miles")!;
      const km = length.units.find((u) => u.id === "kilometers")!;
      const result = convert(1.609344, km, miles, length);

      expect(result.outputValue).toBeCloseTo(1, 6);
    });

    it("converts inches to centimetres correctly", () => {
      const inches = length.units.find((u) => u.id === "inches")!;
      const cm = length.units.find((u) => u.id === "centimeters")!;
      const result = convert(10, inches, cm, length);

      expect(result.outputValue).toBeCloseTo(25.4, 6);
    });

    it("converts very large values (astronomical units to metres)", () => {
      const au = length.units.find((u) => u.id === "astronomical-units")!;
      const meters = length.units.find((u) => u.id === "meters")!;
      const result = convert(1, au, meters, length);

      expect(result.outputValue).toBe(149597870700);
    });

    it("converts very small values (nanometres to metres)", () => {
      const nm = length.units.find((u) => u.id === "nanometers")!;
      const meters = length.units.find((u) => u.id === "meters")!;
      const result = convert(500, nm, meters, length);

      expect(result.outputValue).toBeCloseTo(0.0000005, 10);
    });
  });

  describe("non-linear conversions (toBase/fromBase)", () => {
    it("converts Celsius to Fahrenheit correctly", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temperature.units.find((u) => u.id === "fahrenheit")!;
      const result = convert(0, celsius, fahrenheit, temperature);

      expect(result.outputValue).toBeCloseTo(32, 6);
    });

    it("converts Fahrenheit to Celsius correctly", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temperature.units.find((u) => u.id === "fahrenheit")!;
      const result = convert(32, fahrenheit, celsius, temperature);

      expect(result.outputValue).toBeCloseTo(0, 6);
    });

    it("converts Celsius to Kelvin correctly", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const kelvin = temperature.units.find((u) => u.id === "kelvin")!;
      const result = convert(0, celsius, kelvin, temperature);

      expect(result.outputValue).toBeCloseTo(273.15, 6);
    });

    it("converts Kelvin to Celsius correctly", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const kelvin = temperature.units.find((u) => u.id === "kelvin")!;
      const result = convert(273.15, kelvin, celsius, temperature);

      expect(result.outputValue).toBeCloseTo(0, 6);
    });

    it("converts Fahrenheit to Kelvin correctly", () => {
      const fahrenheit = temperature.units.find((u) => u.id === "fahrenheit")!;
      const kelvin = temperature.units.find((u) => u.id === "kelvin")!;
      const result = convert(212, fahrenheit, kelvin, temperature);

      expect(result.outputValue).toBeCloseTo(373.15, 6);
    });

    it("converts Rankine to Kelvin correctly", () => {
      const rankine = temperature.units.find((u) => u.id === "rankine")!;
      const kelvin = temperature.units.find((u) => u.id === "kelvin")!;
      const result = convert(491.67, rankine, kelvin, temperature);

      expect(result.outputValue).toBeCloseTo(273.15, 6);
    });

    it("converts Kelvin to Rankine correctly", () => {
      const kelvin = temperature.units.find((u) => u.id === "kelvin")!;
      const rankine = temperature.units.find((u) => u.id === "rankine")!;
      const result = convert(273.15, kelvin, rankine, temperature);

      expect(result.outputValue).toBeCloseTo(491.67, 6);
    });

    it("generates correct steps for non-linear conversions", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temperature.units.find((u) => u.id === "fahrenheit")!;
      const result = convert(100, celsius, fahrenheit, temperature);

      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].description).toContain("Celsius to Kelvin");
      expect(result.steps[1].description).toContain("Kelvin to Fahrenheit");
      expect(result.outputValue).toBeCloseTo(212, 6);
    });
  });

  describe("edge cases", () => {
    it("converts same unit (no conversion needed)", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const result = convert(42, meters, meters, length);

      expect(result.outputValue).toBe(42);
      expect(result.inputValue).toBe(42);
      expect(result.steps).toHaveLength(1);
      expect(result.steps[0].description).toContain("Same unit");
    });

    it("handles zero value", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;
      const result = convert(0, meters, feet, length);

      expect(result.outputValue).toBe(0);
    });

    it("handles negative values", () => {
      const celsius = temperature.units.find((u) => u.id === "celsius")!;
      const fahrenheit = temperature.units.find((u) => u.id === "fahrenheit")!;
      const result = convert(-40, celsius, fahrenheit, temperature);

      expect(result.outputValue).toBeCloseTo(-40, 6);
    });

    it("handles very large values", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const km = length.units.find((u) => u.id === "kilometers")!;
      const result = convert(1e15, meters, km, length);

      expect(result.outputValue).toBe(1e12);
    });

    it("handles decimal precision", () => {
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;
      const result = convert(1.234567890123456, meters, feet, length);

      // 1.234567890123456 m / 0.3048 = 4.050419587019213 ft
      expect(result.outputValue).toBeCloseTo(4.050419587019213, 10);
    });

    it("throws error when base unit not found", () => {
      const brokenCategory = {
        ...length,
        baseUnitId: "nonexistent",
      };
      const meters = length.units.find((u) => u.id === "meters")!;
      const feet = length.units.find((u) => u.id === "feet")!;

      expect(() => convert(5, meters, feet, brokenCategory)).toThrow(
        'Base unit "nonexistent" not found in category "length"'
      );
    });

    it("throws error when unit has neither factor nor toBase", () => {
      const brokenUnit = {
        id: "broken",
        name: "Broken",
        symbol: "X",
        precision: "exact" as const,
        formulaToBase: "broken",
        source: "test",
      };
      const meters = length.units.find((u) => u.id === "meters")!;

      expect(() => convert(5, brokenUnit, meters, length)).toThrow(
        'Unit "broken" has neither factor nor toBase'
      );
    });

    it("throws error when target unit has neither factor nor fromBase", () => {
      const brokenUnit = {
        id: "broken",
        name: "Broken",
        symbol: "X",
        precision: "exact" as const,
        formulaToBase: "broken",
        source: "test",
      };
      const meters = length.units.find((u) => u.id === "meters")!;

      expect(() => convert(5, meters, brokenUnit, length)).toThrow(
        'Unit "broken" has neither factor nor fromBase'
      );
    });
  });
});

describe("formatNum", () => {
  it("formats zero correctly", () => {
    expect(formatNum(0)).toBe("0");
  });

  it("formats small integers correctly", () => {
    expect(formatNum(1)).toBe("1");
    expect(formatNum(42)).toBe("42");
    expect(formatNum(123456)).toBe("123456");
  });

  it("formats negative numbers correctly", () => {
    expect(formatNum(-5)).toBe("-5");
    expect(formatNum(-123.456)).toBe("-123.456");
  });

  it("formats decimals correctly", () => {
    expect(formatNum(1.5)).toBe("1.5");
    expect(formatNum(3.14159)).toBe("3.14159");
  });

  it("uses scientific notation for very large numbers (>= 1e15)", () => {
    const result = formatNum(1e15);
    expect(result).toMatch(/e\+/);
  });

  it("uses scientific notation for very small numbers (< 1e-6)", () => {
    const result = formatNum(1e-7);
    expect(result).toMatch(/e-/);
  });

  it("does not use scientific notation for boundary values", () => {
    expect(formatNum(1e14)).not.toMatch(/e/);
    expect(formatNum(1e-6)).not.toMatch(/e/);
  });

  it("handles NaN correctly", () => {
    expect(formatNum(NaN)).toBe("NaN");
  });

  it("handles Infinity correctly", () => {
    expect(formatNum(Infinity)).toBe("Infinity");
    expect(formatNum(-Infinity)).toBe("-Infinity");
  });

  it("removes trailing zeros after decimal point", () => {
    expect(formatNum(1.5000000000001)).toBe("1.5");
    expect(formatNum(10.00000000000001)).toBe("10");
  });

  it("maintains precision for meaningful digits", () => {
    const result = formatNum(123.456789012345);
    expect(result).not.toBe("123");
    expect(parseFloat(result)).toBeCloseTo(123.456789012345, 8);
  });
});
