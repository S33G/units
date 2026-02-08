import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConversionDisplay } from "@/app/components/ConversionDisplay";
import { FormulaExplainer } from "@/app/components/FormulaExplainer";
import { UnitSelect } from "@/app/components/UnitSelect";
import { SwapButton } from "@/app/components/SwapButton";
import { ShareButton } from "@/app/components/ShareButton";
import { CategorySidebar } from "@/app/components/CategorySidebar";
import { length } from "@/lib/categories/length";
import { convert } from "@/lib/convert";

afterEach(() => {
  vi.useRealTimers();
});

describe("ConversionDisplay", () => {
  it("shows placeholder when no result", () => {
    render(<ConversionDisplay result={null} />);
    expect(screen.getByText(/enter a valid number/i)).toBeInTheDocument();
  });

  it("displays conversion result", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    render(<ConversionDisplay result={result} />);
    expect(screen.getAllByText(/5/).length).toBeGreaterThan(0);
    expect(screen.getByText(/m =/)).toBeInTheDocument();
    expect(screen.getByText(/ft/)).toBeInTheDocument();
  });

  it("formats numbers correctly in display", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(1, meters, feet, length);

    render(<ConversionDisplay result={result} />);
    expect(screen.getByText(/3\.2808/i)).toBeInTheDocument();
  });
});

describe("FormulaExplainer", () => {
  it("shows placeholder when no result", () => {
    render(<FormulaExplainer result={null} />);
    expect(screen.getByText(/select units and enter a value/i)).toBeInTheDocument();
  });

  it("displays conversion steps", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    render(<FormulaExplainer result={result} />);
    expect(screen.getByText(/how this conversion works/i)).toBeInTheDocument();
    expect(screen.getByText(/Meters → Meters → Feet/i)).toBeInTheDocument();
  });

  it("displays precision information", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    render(<FormulaExplainer result={result} />);
    expect(screen.getByText(/precision/i)).toBeInTheDocument();
    expect(screen.getAllByText(/exact/i).length).toBeGreaterThan(0);
  });

  it("displays source information", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    render(<FormulaExplainer result={result} />);
    expect(screen.getByText(/sources/i)).toBeInTheDocument();
    expect(screen.getByText(/SI base unit/i)).toBeInTheDocument();
  });

  it("displays each conversion step", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    render(<FormulaExplainer result={result} />);
    result.steps.forEach((step) => {
      expect(screen.getByText(new RegExp(step.description, "i"))).toBeInTheDocument();
    });
  });

  it("handles missing base unit gracefully", () => {
    const meters = length.units.find((u) => u.id === "meters")!;
    const feet = length.units.find((u) => u.id === "feet")!;
    const result = convert(5, meters, feet, length);

    const invalidResult = {
      ...result,
      category: {
        ...result.category,
        baseUnitId: "nonexistent-unit-id",
      },
    };

    render(<FormulaExplainer result={invalidResult} />);
    expect(screen.getByText(/Meters → Base → Feet/i)).toBeInTheDocument();
  });
});

describe("UnitSelect", () => {
  const units = length.units.slice(0, 3);
  const onChangeMock = vi.fn();

  it("renders all unit options", () => {
    render(<UnitSelect units={units} selected={units[0].id} onChangeAction={onChangeMock} label="From" />);

    units.forEach((unit) => {
      expect(screen.getByText(new RegExp(unit.name, "i"))).toBeInTheDocument();
    });
  });

  it("displays label", () => {
    render(<UnitSelect units={units} selected={units[0].id} onChangeAction={onChangeMock} label="Test Label" />);
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
  });

  it("shows selected unit", () => {
    render(<UnitSelect units={units} selected={units[1].id} onChangeAction={onChangeMock} label="From" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue(units[1].id);
  });

  it("calls onChangeAction when unit is selected", async () => {
    const user = userEvent.setup();
    render(<UnitSelect units={units} selected={units[0].id} onChangeAction={onChangeMock} label="From" />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, units[2].id);

    expect(onChangeMock).toHaveBeenCalledWith(units[2].id);
  });

  it("displays unit symbols", () => {
    render(<UnitSelect units={units} selected={units[0].id} onChangeAction={onChangeMock} label="From" />);
    units.forEach((unit) => {
      expect(screen.getByText(new RegExp(`\\(${unit.symbol}\\)`, "i"))).toBeInTheDocument();
    });
  });
});

describe("SwapButton", () => {
  it("renders swap icon", () => {
    const onSwapMock = vi.fn();
    render(<SwapButton onSwapAction={onSwapMock} />);
    expect(screen.getByRole("button", { name: /swap units/i })).toBeInTheDocument();
  });

  it("calls onSwapAction when clicked", async () => {
    const user = userEvent.setup();
    const onSwapMock = vi.fn();
    render(<SwapButton onSwapAction={onSwapMock} />);

    await user.click(screen.getByRole("button", { name: /swap units/i }));
    expect(onSwapMock).toHaveBeenCalledTimes(1);
  });
});

describe("ShareButton", () => {
  it("renders share button", () => {
    render(<ShareButton />);
    expect(screen.getByRole("button", { name: /share conversion/i })).toBeInTheDocument();
  });

  it("shows check icon after clicking and resets after 2 seconds", async () => {
    vi.useFakeTimers();
    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.defineProperty(navigator, "clipboard", {
      value: clipboardMock,
      writable: true,
      configurable: true,
    });

    render(<ShareButton />);
    const button = screen.getByRole("button", { name: /share conversion/i });

    button.click();

    await vi.waitFor(() => {
      expect(clipboardMock.writeText).toHaveBeenCalled();
    });

    await vi.waitFor(() => {
      expect(screen.getByRole("button")).toHaveClass("bg-green-100");
    });

    await act(async () => {
      vi.advanceTimersByTime(2001);
    });

    await vi.waitFor(() => {
      expect(screen.getByRole("button")).not.toHaveClass("bg-green-100");
    });
  });
});

describe("CategorySidebar", () => {
  const categories = [
    { id: "cat1", name: "Category 1", icon: "📏", baseUnitId: "base1", units: [] },
    { id: "cat2", name: "Category 2", icon: "🌡️", baseUnitId: "base2", units: [] },
  ];
  const onSelectMock = vi.fn();

  it("renders all categories", () => {
    render(<CategorySidebar categories={categories} selected="cat1" onSelectAction={onSelectMock} />);

    categories.forEach((cat) => {
      expect(screen.getByText(cat.name)).toBeInTheDocument();
      expect(screen.getByText(cat.icon)).toBeInTheDocument();
    });
  });

  it("calls onSelectAction when category is clicked", async () => {
    const user = userEvent.setup();
    render(<CategorySidebar categories={categories} selected="cat1" onSelectAction={onSelectMock} />);

    await user.click(screen.getByText("Category 2"));
    expect(onSelectMock).toHaveBeenCalledWith("cat2");
  });

  it("highlights selected category", () => {
    render(<CategorySidebar categories={categories} selected="cat1" onSelectAction={onSelectMock} />);
    const button = screen.getByRole("button", { name: /📏Category 1/i });
    expect(button).toHaveClass("text-zinc-900");
  });
});
