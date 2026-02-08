import { describe, it, expect, beforeEach, vi } from "vitest";

import { loadConverterState, saveConverterState, type ConverterState } from "./storage";

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("saveConverterState", () => {
    it("saves valid state to localStorage", () => {
      const state: ConverterState = {
        categoryId: "length",
        fromUnitId: "meters",
        toUnitId: "feet",
        inputValue: "10",
      };

      saveConverterState(state);

      const stored = localStorage.getItem("units-converter-state");
      expect(stored).toBe(JSON.stringify(state));
    });

    it("handles localStorage unavailable gracefully", () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const state: ConverterState = {
        categoryId: "length",
        fromUnitId: "meters",
        toUnitId: "feet",
        inputValue: "10",
      };

      expect(() => saveConverterState(state)).not.toThrow();
      expect(setItemSpy).toHaveBeenCalledOnce();
    });

    it("does nothing in SSR environment", () => {
      const originalWindow = global.window;
      // @ts-expect-error - testing SSR
      delete global.window;

      const state: ConverterState = {
        categoryId: "length",
        fromUnitId: "meters",
        toUnitId: "feet",
        inputValue: "10",
      };

      expect(() => saveConverterState(state)).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("loadConverterState", () => {
    it("loads valid state from localStorage", () => {
      const state: ConverterState = {
        categoryId: "temperature",
        fromUnitId: "celsius",
        toUnitId: "fahrenheit",
        inputValue: "25",
      };

      localStorage.setItem("units-converter-state", JSON.stringify(state));

      const loaded = loadConverterState();
      expect(loaded).toEqual(state);
    });

    it("returns null when no state exists", () => {
      const loaded = loadConverterState();
      expect(loaded).toBeNull();
    });

    it("returns null when stored data is invalid JSON", () => {
      localStorage.setItem("units-converter-state", "invalid-json");

      const loaded = loadConverterState();
      expect(loaded).toBeNull();
    });

    it("handles localStorage unavailable gracefully", () => {
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      const loaded = loadConverterState();
      expect(loaded).toBeNull();
      expect(getItemSpy).toHaveBeenCalledOnce();
    });

    it("returns null in SSR environment", () => {
      const originalWindow = global.window;
      // @ts-expect-error - testing SSR
      delete global.window;

      const loaded = loadConverterState();
      expect(loaded).toBeNull();

      global.window = originalWindow;
    });
  });

  describe("integration", () => {
    it("saves and loads state correctly", () => {
      const state: ConverterState = {
        categoryId: "volume",
        fromUnitId: "liters",
        toUnitId: "gallons",
        inputValue: "5.5",
      };

      saveConverterState(state);
      const loaded = loadConverterState();

      expect(loaded).toEqual(state);
    });

    it("overwrites previous state", () => {
      const state1: ConverterState = {
        categoryId: "mass",
        fromUnitId: "kilograms",
        toUnitId: "pounds",
        inputValue: "100",
      };

      const state2: ConverterState = {
        categoryId: "length",
        fromUnitId: "meters",
        toUnitId: "feet",
        inputValue: "50",
      };

      saveConverterState(state1);
      saveConverterState(state2);

      const loaded = loadConverterState();
      expect(loaded).toEqual(state2);
    });
  });
});
