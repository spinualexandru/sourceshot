import { describe, expect, it } from "vite-plus/test";
import { themeOptions } from "@sourceshot/core";
import { resolveThemeStyle } from "./theme-style.ts";

const themes = themeOptions.map((option) => option.value);

describe("resolveThemeStyle", () => {
  it("covers every theme the app offers", () => {
    expect(themes).toEqual(["mono", "mono-dark", "peach", "ocean"]);
  });

  it.each(themes)("resolves %s to literal CSS satori understands", (theme) => {
    const style = resolveThemeStyle(theme);
    const gradients = [
      style.frameBase,
      ...style.frameGlows,
      style.cardBorder,
      style.cardFill,
      ...style.cardGlows,
      ...style.cardOverlay.images,
    ];

    for (const gradient of gradients) {
      // Nothing satori cannot parse may survive this stage.
      expect(gradient).not.toMatch(/var\(|calc\(|color-mix\(/);
      // A bare `transparent` would fringe grey through an SVG gradient.
      expect(gradient).not.toMatch(/\btransparent\b/);
    }

    expect(style.grainOpacity).toBeGreaterThan(0);
    expect(style.codeForeground).toMatch(/^#/);
  });

  it.each(themes)("keeps %s gradient stops stable", (theme) => {
    expect(resolveThemeStyle(theme)).toMatchSnapshot();
  });

  it("clamps alpha when a dark reflex multiplier exceeds one", () => {
    // mono-dark uses --glass-reflex-dark: 1.9, which can push a mix past 100%.
    const style = resolveThemeStyle("mono-dark");
    const alphas = [...style.cardShadow.matchAll(/rgba\([^)]*?,\s*([\d.]+)\)/g)];

    expect(alphas.length).toBeGreaterThan(0);
    for (const [, value] of alphas) {
      expect(Number.parseFloat(value)).toBeLessThanOrEqual(1);
    }
  });
});
