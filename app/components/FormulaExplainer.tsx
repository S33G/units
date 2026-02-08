import { formatNum } from "@/lib/convert";
import type { ConversionResult } from "@/lib/types";

type FormulaExplainerProps = {
  result: ConversionResult | null;
};

export function FormulaExplainer({ result }: FormulaExplainerProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">How this conversion works</h2>
      {result ? (
        <div className="mt-3 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {result.fromUnit.name} → {result.category.units.find((unit) => unit.id === result.category.baseUnitId)?.name ?? "Base"} → {result.toUnit.name}
          </p>

          <ol className="space-y-3">
            {result.steps.map((step, index) => (
              <li key={`${step.description}-${index}`} className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>

                <p className="mt-2 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {step.formula} = {formatNum(step.result)} {step.unit}
                </p>
              </li>
            ))}
          </ol>

          <div className="grid gap-3 text-xs text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
            <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Precision</p>
              <p className="mt-1">From unit: {result.fromUnit.precision}</p>
              <p>To unit: {result.toUnit.precision}</p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Sources</p>
              <p className="mt-1">From: {result.fromUnit.source}</p>
              <p className="mt-1">To: {result.toUnit.source}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Select units and enter a value to see step-by-step formulas.
        </p>
      )}
    </section>
  );
}
