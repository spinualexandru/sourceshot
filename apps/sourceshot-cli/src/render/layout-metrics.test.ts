import { describe, expect, it } from "vite-plus/test";
import { minCardWidth, minSnapshotHeight, minSnapshotWidth } from "@sourceshot/core";
import { computeLayout } from "./layout-metrics.ts";

describe("computeLayout", () => {
  it("clamps a tiny snippet to the minimum card and frame size", () => {
    const layout = computeLayout({ columns: 4, lines: 1 });

    expect(layout.cardWidth).toBe(minCardWidth);
    expect(layout.width).toBeGreaterThanOrEqual(minSnapshotWidth);
    expect(layout.height).toBeGreaterThanOrEqual(minSnapshotHeight);
  });

  it("never returns a frame below the minimum height", () => {
    expect(computeLayout({ columns: 1, lines: 1 }).height).toBeGreaterThanOrEqual(
      minSnapshotHeight,
    );
  });

  it("grows the card to fit long lines when unbounded", () => {
    const narrow = computeLayout({ columns: 40, lines: 3 });
    const wide = computeLayout({ columns: 300, lines: 3 });

    expect(wide.cardWidth).toBeGreaterThan(narrow.cardWidth);
    expect(wide.width).toBeGreaterThan(1280);
  });

  it("honours an explicit card width ceiling", () => {
    const layout = computeLayout({ columns: 300, lines: 3, maxCardWidth: 1126 });

    expect(layout.cardWidth).toBe(1126);
  });

  it("switches to the narrow padding for small viewports", () => {
    const wide = computeLayout({ columns: 10, lines: 2 });
    const narrow = computeLayout({ columns: 10, lines: 2, viewport: 400 });

    expect(wide.padding).toBe(64);
    expect(narrow.padding).toBe(28);
  });

  it("adds one line of height per line of code", () => {
    const two = computeLayout({ columns: 10, lines: 2 });
    const twelve = computeLayout({ columns: 10, lines: 12 });

    expect(twelve.height - two.height).toBe(Math.ceil(10 * 16 * 1.55));
  });

  it("reports fewer visible columns than a clipped line contains", () => {
    const layout = computeLayout({ columns: 300, lines: 1, maxCardWidth: 1126 });

    expect(layout.visibleColumns).toBeLessThan(300);
    expect(layout.visibleColumns).toBeGreaterThan(0);
  });
});
