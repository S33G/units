"use client";

type SwapButtonProps = {
  onSwapAction: () => void;
};

export function SwapButton({ onSwapAction }: SwapButtonProps) {
  return (
    <button
      type="button"
      onClick={onSwapAction}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-lg text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
      aria-label="Swap units"
    >
      ⇄
    </button>
  );
}
