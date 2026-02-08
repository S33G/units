import { formatNum } from "@/lib/convert";
import type { ConversionResult } from "@/lib/types";

type ConversionDisplayProps = {
  result: ConversionResult | null;
};

export function ConversionDisplay({ result }: ConversionDisplayProps) {
  if (!result) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Enter a valid number to convert.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-100">
        <span className="font-mono">{formatNum(result.inputValue)}</span> {result.fromUnit.symbol} ={" "}
        <span className="font-mono">{formatNum(result.outputValue)}</span> {result.toUnit.symbol}
      </p>
    </div>
  );
}
