const STORAGE_KEY = "units-converter-state";

export type ConverterState = {
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  inputValue: string;
};

export function saveConverterState(state: ConverterState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, disabled, or quota exceeded)
  }
}

export function loadConverterState(): ConverterState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ConverterState;
  } catch {
    return null;
  }
}
