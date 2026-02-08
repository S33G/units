import type { Category, ConversionResult, ConversionStep, UnitDef } from "@/lib/types";

function unitToBase(unit: UnitDef, value: number): number {
  if (unit.toBase) return unit.toBase(value);
  if (unit.factor !== undefined) return value * unit.factor;
  throw new Error(`Unit "${unit.id}" has neither factor nor toBase`);
}

function unitFromBase(unit: UnitDef, value: number): number {
  if (unit.fromBase) return unit.fromBase(value);
  if (unit.factor !== undefined) return value / unit.factor;
  throw new Error(`Unit "${unit.id}" has neither factor nor fromBase`);
}

export function convert(
  value: number,
  fromUnit: UnitDef,
  toUnit: UnitDef,
  category: Category,
): ConversionResult {
  const baseUnit = category.units.find((u) => u.id === category.baseUnitId);
  if (!baseUnit) {
    throw new Error(`Base unit "${category.baseUnitId}" not found in category "${category.id}"`);
  }

  const steps: ConversionStep[] = [];
  let current = value;

  if (fromUnit.id === toUnit.id) {
    steps.push({
      description: "Same unit — no conversion needed",
      formula: `${formatNum(value)}`,
      result: value,
      unit: toUnit.symbol,
    });
    return { inputValue: value, outputValue: value, fromUnit, toUnit, category, steps };
  }

  const baseValue = unitToBase(fromUnit, value);
  steps.push({
    description: `Convert ${fromUnit.name} to ${baseUnit.name}`,
    formula: fromUnit.formulaToBase.replace(/value/g, formatNum(value)),
    result: baseValue,
    unit: baseUnit.symbol,
  });
  current = baseValue;

  if (toUnit.id !== category.baseUnitId) {
    const outputValue = unitFromBase(toUnit, baseValue);
    const inverseFormula = toUnit.formulaToBase.includes("value ×")
      ? `${formatNum(baseValue)} ÷ ${toUnit.factor ?? "?"}`
      : toUnit.formulaToBase.replace(/value/g, formatNum(baseValue));

    steps.push({
      description: `Convert ${baseUnit.name} to ${toUnit.name}`,
      formula: inverseFormula,
      result: outputValue,
      unit: toUnit.symbol,
    });
    current = outputValue;
  }

  return {
    inputValue: value,
    outputValue: current,
    fromUnit,
    toUnit,
    category,
    steps,
  };
}

export function formatNum(n: number): string {
  if (Number.isNaN(n) || !Number.isFinite(n)) return String(n);

  const abs = Math.abs(n);
  if (abs === 0) return "0";
  if (abs >= 1e15 || (abs < 1e-6 && abs > 0)) {
    return n.toExponential(6);
  }

  const str = n.toPrecision(12);
  return parseFloat(str).toString();
}
