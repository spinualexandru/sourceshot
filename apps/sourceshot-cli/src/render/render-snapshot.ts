import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { ReactNode } from "react";
import {
  type AppTheme,
  type CodeLanguage,
  getSnapshotPixelRatio,
  renderCodeTokens,
} from "@sourceshot/core";
import { clipLines, maxColumns, toCodeLines, trimTrailingBlankLines } from "./code-lines.ts";
import { buildElementTree } from "./element-tree.ts";
import { loadCodeFonts } from "./fonts.ts";
import { defaultGrainStrength } from "./grain.ts";
import { computeLayout } from "./layout-metrics.ts";
import { resolveThemeStyle } from "./theme-style.ts";

export type RenderOptions = {
  code: string;
  language: CodeLanguage;
  theme: AppTheme;
  viewport?: number;
  maxCardWidth?: number;
  grainStrength?: number;
  scale?: number;
};

export type RenderResult = { png: Buffer; svg: string; width: number; height: number };

export async function renderSnapshot({
  code,
  language,
  theme,
  viewport,
  maxCardWidth,
  grainStrength = defaultGrainStrength,
  scale,
}: RenderOptions): Promise<RenderResult> {
  const style = resolveThemeStyle(theme);
  const { tokens } = await renderCodeTokens(code, language, theme);
  const lines = trimTrailingBlankLines(toCodeLines(tokens, style.codeForeground));
  const layout = computeLayout({
    columns: maxColumns(lines),
    lines: lines.length,
    viewport,
    maxCardWidth,
  });

  const svg = await satori(
    buildElementTree({
      lines: clipLines(lines, layout.visibleColumns),
      layout,
      style,
      grainStrength,
    }) as unknown as ReactNode,
    { width: layout.width, height: layout.height, fonts: await loadCodeFonts() },
  );

  const pixelRatio = scale ?? getSnapshotPixelRatio(layout.width, layout.height);
  const png = new Resvg(svg, {
    // satori embeds glyphs as outlines, so resvg never needs a font database.
    font: { loadSystemFonts: false },
    fitTo: { mode: "zoom", value: pixelRatio },
  })
    .render()
    .asPng();

  return { png, svg, width: layout.width, height: layout.height };
}
