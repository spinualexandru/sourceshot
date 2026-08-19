/**
 * Colour helpers for translating the website's CSS into satori's subset.
 *
 * `color-mix(in srgb, C P%, transparent)` is exactly "C at alpha P/100", so every
 * such expression in style.css collapses to an rgba() literal we can compute here.
 */

export type Rgba = { r: number; g: number; b: number; a: number };

const hexPattern = /^#([\da-f]{3,8})$/i;
const rgbPattern = /^rgba?\(([^)]+)\)$/i;

export function parseColor(value: string): Rgba {
  const input = value.trim();
  const hex = hexPattern.exec(input);

  if (hex) {
    const digits = hex[1];

    if (digits.length === 3 || digits.length === 4) {
      const r = digits[0];
      const g = digits[1];
      const b = digits[2];
      const a = digits[3] ?? "f";
      return {
        r: Number.parseInt(`${r}${r}`, 16),
        g: Number.parseInt(`${g}${g}`, 16),
        b: Number.parseInt(`${b}${b}`, 16),
        a: Number.parseInt(`${a}${a}`, 16) / 255,
      };
    }

    return {
      r: Number.parseInt(digits.slice(0, 2), 16),
      g: Number.parseInt(digits.slice(2, 4), 16),
      b: Number.parseInt(digits.slice(4, 6), 16),
      a: digits.length === 8 ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgb = rgbPattern.exec(input);

  if (rgb) {
    const parts = rgb[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r: parts[0] ?? 0, g: parts[1] ?? 0, b: parts[2] ?? 0, a: parts[3] ?? 1 };
  }

  throw new Error(`Unsupported colour value: ${value}`);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function round(value: number, places = 4) {
  return Number.parseFloat(value.toFixed(places));
}

export function toRgba({ r, g, b, a }: Rgba) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${round(clamp01(a))})`;
}

/** `color-mix(in srgb, colour percent%, transparent)`. */
export function alpha(colour: string, percent: number) {
  const parsed = parseColor(colour);
  return toRgba({ ...parsed, a: clamp01((percent / 100) * parsed.a) });
}

/**
 * A fully transparent version of a colour, keeping its hue.
 *
 * SVG gradients interpolate non-premultiplied, so fading to the keyword
 * `transparent` (= rgba(0,0,0,0)) leaves a grey fringe. Fading to the same hue at
 * alpha 0 is what browsers effectively do.
 */
export function fade(colour: string) {
  return toRgba({ ...parseColor(colour), a: 0 });
}

/** Linear interpolation between two colours in sRGB. */
export function mix(from: string, to: string, ratio: number) {
  const a = parseColor(from);
  const b = parseColor(to);
  const t = clamp01(ratio);

  return toRgba({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
    a: a.a + (b.a - a.a) * t,
  });
}

/** Approximates CSS `saturate()` / `brightness()` filters on a single colour. */
export function adjust(colour: string, saturation: number, brightness: number) {
  const { r, g, b, a } = parseColor(colour);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return toRgba({
    r: clamp01(((luma + (r - luma) * saturation) * brightness) / 255) * 255,
    g: clamp01(((luma + (g - luma) * saturation) * brightness) / 255) * 255,
    b: clamp01(((luma + (b - luma) * saturation) * brightness) / 255) * 255,
    a,
  });
}
