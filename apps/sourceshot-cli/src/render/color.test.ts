import { describe, expect, it } from "vite-plus/test";
import { adjust, alpha, fade, mix, parseColor } from "./color.ts";

describe("parseColor", () => {
  it("reads shorthand hex", () => {
    expect(parseColor("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("reads full hex", () => {
    expect(parseColor("#222323")).toEqual({ r: 34, g: 35, b: 35, a: 1 });
  });

  it("reads rgba()", () => {
    expect(parseColor("rgba(34, 35, 35, 0.5)")).toEqual({ r: 34, g: 35, b: 35, a: 0.5 });
  });

  it("rejects unsupported syntax", () => {
    expect(() => parseColor("hsl(0 0% 0%)")).toThrow();
  });
});

describe("alpha", () => {
  it("treats a percentage as the resulting alpha", () => {
    expect(alpha("#ffffff", 40)).toBe("rgba(255, 255, 255, 0.4)");
  });

  it("compounds with an existing alpha", () => {
    expect(alpha("rgba(0, 0, 0, 0.5)", 50)).toBe("rgba(0, 0, 0, 0.25)");
  });

  it("clamps above 100 percent", () => {
    expect(alpha("#ffffff", 190)).toBe("rgba(255, 255, 255, 1)");
  });
});

describe("fade", () => {
  it("keeps the hue so SVG gradients do not fringe", () => {
    expect(fade("#cf536d")).toBe("rgba(207, 83, 109, 0)");
  });
});

describe("mix", () => {
  it("interpolates halfway", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("rgba(128, 128, 128, 1)");
  });
});

describe("adjust", () => {
  it("leaves a colour alone at identity settings", () => {
    expect(adjust("#3d5f83", 1, 1)).toBe("rgba(61, 95, 131, 1)");
  });

  it("desaturates towards grey", () => {
    expect(adjust("#ff0000", 0, 1)).toBe("rgba(54, 54, 54, 1)");
  });
});
