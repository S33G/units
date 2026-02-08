import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz");
  });

  it("handles undefined and null", () => {
    expect(cn("foo", undefined, "bar", null)).toBe("foo bar");
  });

  it("merges Tailwind classes correctly (deduplicates)", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("handles arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("resolves Tailwind conflicts correctly", () => {
    expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-white bg-black")).toBe("bg-black");
  });

  it("preserves order for non-conflicting classes", () => {
    expect(cn("flex items-center justify-between")).toBe("flex items-center justify-between");
  });
});
