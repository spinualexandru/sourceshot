import { type AppTheme, getThemeDefinition } from "@sourceshot/core";
import { adjust, alpha, fade, mix } from "./color.ts";

/**
 * Translates a theme's CSS custom properties into the flat, literal values satori
 * needs — no var(), no calc(), no color-mix() survives this module.
 *
 * Gradient stops are written with explicit start/end positions because satori's
 * parser rejects the double-position shorthand (`<colour> 0 16%`) used in style.css.
 */
export type ThemeStyle = {
  frameBase: string;
  frameGlows: readonly string[];
  grainOpacity: number;
  cardBorder: string;
  cardFill: string;
  cardFillTint: string;
  cardGlows: readonly string[];
  cardOverlay: { opacity: number; images: readonly string[] };
  cardHairline: string;
  cardShadow: string;
  codeForeground: string;
};

export function resolveThemeStyle(theme: AppTheme): ThemeStyle {
  const { variables } = getThemeDefinition(theme);
  const light = Number.parseFloat(variables["--glass-reflex-light"]);
  const dark = Number.parseFloat(variables["--glass-reflex-dark"]);
  const percent = (value: string) => Number.parseFloat(value);

  const glassLight = variables["--glass-light"];
  const glassDark = variables["--glass-dark"];
  const glass = variables["--glass"];

  // .snapshot-frame background, bottom layer first.
  const frameBase = `linear-gradient(135deg, ${variables["--bg-glow-light"]}, ${variables["--bg"]} 38%, ${variables["--bg-glow-rose"]} 72%, ${variables["--bg-glow-warm"]})`;

  const glow = (position: string, colour: string, strength: number, from: number, to: number) =>
    `radial-gradient(circle at ${position}, ${alpha(colour, strength)} 0%, ${alpha(colour, strength)} ${from}%, ${fade(colour)} ${to}%)`;

  const frameGlows = [
    glow("16% 18%", variables["--bg-glow-warm"], 72, 22, 50),
    glow("50% 48%", variables["--bg-glow-violet"], 62, 18, 46),
    glow("78% 22%", variables["--bg-glow-rose"], 76, 20, 52),
    glow("10% 82%", variables["--bg-glow-light"], 74, 16, 42),
  ];

  // backdrop-filter is unsupported, so approximate what the card sees through it:
  // the frame gradient sampled at the card's centre, saturated and brightened.
  const backdrop = mix(variables["--bg"], variables["--bg-glow-rose"], 0.35);
  const saturation = percent(variables["--glass-saturation"]) / 100;
  const cardFillTint = adjust(backdrop, saturation, 1.08);

  const cardBorder = `linear-gradient(45deg, ${alpha(glassLight, percent(variables["--code-container-border-start"]))}, ${alpha(glassLight, 40)} 22%, ${alpha(glassDark, 16)} 38%, ${alpha(glass, 48)} 62%, ${alpha(glassDark, 11)} 78%, ${alpha(glassLight, percent(variables["--code-container-border-end"]))})`;

  const cardFill = `linear-gradient(145deg, ${alpha(variables["--code-container-bg"], percent(variables["--code-container-fill-start"]))}, ${alpha(glass, percent(variables["--code-container-fill-mid"]))} 46%, ${alpha(glassLight, percent(variables["--code-container-shine"]))} 100%)`;

  const topReflex = light * percent(variables["--code-container-top-reflex"]);
  const cardGlows = [
    `radial-gradient(circle at 50% 100%, ${alpha(glassDark, dark * 9)} 0%, ${fade(glassDark)} 48%)`,
    `radial-gradient(circle at 82% 0%, ${alpha(glassLight, topReflex)} 0%, ${alpha(glassLight, topReflex)} 18%, ${fade(glassLight)} 44%)`,
  ];

  const cardOverlay = {
    opacity: Number.parseFloat(variables["--code-container-overlay-opacity"]),
    images: [
      `linear-gradient(115deg, ${alpha(glassLight, light * 34)}, ${fade(glassLight)} 28%, ${fade(glassDark)} 70%, ${alpha(glassDark, dark * 6)})`,
      `radial-gradient(circle at 82% 88%, ${alpha(variables["--bg-glow-rose"], 14)} 0%, ${fade(variables["--bg-glow-rose"])} 44%)`,
    ],
  };

  return {
    frameBase,
    frameGlows,
    grainOpacity: Number.parseFloat(variables["--bg-noise-opacity"]),
    cardBorder,
    cardFill,
    cardFillTint,
    cardGlows,
    cardOverlay,
    // Replaces `inset 0 0 0 1px` from the box-shadow stack.
    cardHairline: alpha(glassLight, light * 14),
    // The two outer shadows carry the "floating card" read; the inset stack is trimmed.
    cardShadow: `0 1px 6px ${alpha(glassDark, dark * 10)}, 0 18px 46px ${alpha(glassDark, dark * 18)}, inset 2px 3px 0 -2px ${alpha(glassLight, light * 92)}, inset -3px -2px 0 -2px ${alpha(glassLight, light * 78)}`,
    codeForeground: variables["--text-h"],
  };
}
