import {
  cardBorderRadius,
  cardBorderWidth,
  cardPadding,
  codeLineHeight,
  editorFontSize,
  editorPadding,
} from "@sourceshot/core";
import type { CodeLine } from "./code-lines.ts";
import { codeFontFamily } from "./fonts.ts";
import { getGrainTile, grainTileSize } from "./grain.ts";
import { type Element, h, layer } from "./h.ts";
import type { Layout } from "./layout-metrics.ts";
import type { ThemeStyle } from "./theme-style.ts";

export type TreeInput = {
  lines: readonly CodeLine[];
  layout: Layout;
  style: ThemeStyle;
  grainStrength: number;
};

function renderCodeLine(line: CodeLine): Element {
  return h(
    "div",
    { display: "flex", flexDirection: "row", height: codeLineHeight, flexShrink: 0 },
    line.spans.map((span) =>
      h(
        "span",
        {
          whiteSpace: "pre",
          flexShrink: 0,
          color: span.color,
          ...(span.bold ? { fontWeight: 700 } : {}),
          ...(span.italic ? { fontStyle: "italic" } : {}),
        },
        span.text,
      ),
    ),
  );
}

/**
 * satori's `backgroundImage` accepts a single value and there is no z-index, so each
 * CSS background layer becomes its own absolutely-positioned div, painted in DOM order
 * (bottom first).
 */
export function buildElementTree({ lines, layout, style, grainStrength }: TreeInput): Element {
  const innerRadius = cardBorderRadius - cardBorderWidth;

  const code = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      padding: editorPadding,
      fontFamily: codeFontFamily,
      fontSize: editorFontSize,
      color: style.codeForeground,
      whiteSpace: "pre",
    },
    lines.map(renderCodeLine),
  );

  const cardFill = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      position: "relative",
      overflow: "hidden",
      borderRadius: innerRadius,
      padding: cardPadding,
      backgroundColor: style.cardFillTint,
      backgroundImage: style.cardFill,
    },
    [
      ...style.cardGlows.map((image) => layer({ backgroundImage: image })),
      layer({ opacity: style.cardOverlay.opacity, backgroundImage: style.cardOverlay.images[0] }, [
        layer({ backgroundImage: style.cardOverlay.images[1] }),
      ]),
      // Stands in for the `inset 0 0 0 1px` highlight.
      layer({ borderRadius: innerRadius, border: `1px solid ${style.cardHairline}` }),
      code,
    ],
  );

  const card = h(
    "div",
    {
      display: "flex",
      width: layout.cardWidth,
      borderRadius: cardBorderRadius,
      padding: cardBorderWidth,
      backgroundImage: style.cardBorder,
      boxShadow: style.cardShadow,
    },
    [cardFill],
  );

  return h(
    "div",
    {
      display: "flex",
      width: layout.width,
      height: layout.height,
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundImage: style.frameBase,
    },
    [
      ...style.frameGlows.map((image) => layer({ backgroundImage: image })),
      layer({
        opacity: style.grainOpacity * grainStrength,
        backgroundImage: `url(${getGrainTile()})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${grainTileSize}px ${grainTileSize}px`,
      }),
      card,
    ],
  );
}
