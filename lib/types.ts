/**
 * Core types for the unit conversion engine.
 *
 * Design: each category has a "base unit". Every unit defines how to convert
 * to/from that base. Converting unit A → unit B goes A → base → B.
 */

/** How a conversion factor was determined */
export type FactorPrecision = "exact" | "approximate";

/**
 * A single unit within a category.
 *
 * For linear conversions (most units), only `factor` is needed:
 *   toBase(v) = v * factor
 *   fromBase(v) = v / factor
 *
 * For non-linear conversions (temperature, fuel economy),
 * provide `toBase` and `fromBase` functions directly.
 */
export type UnitDef = {
  /** Machine-readable identifier, e.g. "meters" */
  id: string;
  /** Human-readable name, e.g. "Meters" */
  name: string;
  /** Symbol or abbreviation, e.g. "m" */
  symbol: string;
  /** For linear units: multiply by this to get to base unit */
  factor?: number;
  /** Custom conversion to base unit (for non-linear units) */
  toBase?: (value: number) => number;
  /** Custom conversion from base unit (for non-linear units) */
  fromBase?: (value: number) => number;
  /** Whether the factor is exact or approximate */
  precision: FactorPrecision;
  /**
   * Human-readable formula shown in the transparency panel.
   * e.g. "value × 1609.344" or "(value − 32) × 5/9 + 273.15"
   */
  formulaToBase: string;
  /** Source/definition note, e.g. "International mile, exact by definition" */
  source: string;
};

/** A category of related units (e.g. "Length & Distance") */
export type Category = {
  /** Machine-readable identifier, e.g. "length" */
  id: string;
  /** Human-readable name, e.g. "Length & Distance" */
  name: string;
  /** Short icon/emoji for the category pill */
  icon: string;
  /** The base unit's id within this category */
  baseUnitId: string;
  /** All units in this category */
  units: UnitDef[];
};

/** The result of a conversion, including transparency info */
export type ConversionResult = {
  /** The input value */
  inputValue: number;
  /** The output value */
  outputValue: number;
  /** The source unit */
  fromUnit: UnitDef;
  /** The target unit */
  toUnit: UnitDef;
  /** The category */
  category: Category;
  /** Step-by-step explanation */
  steps: ConversionStep[];
};

/** A single step in the conversion explanation */
export type ConversionStep = {
  /** Human-readable description of this step */
  description: string;
  /** The formula applied, e.g. "5 × 1609.344" */
  formula: string;
  /** The result of this step */
  result: number;
  /** Unit symbol at this step */
  unit: string;
};
