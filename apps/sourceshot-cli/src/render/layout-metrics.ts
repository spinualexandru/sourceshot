import {
  cardBorderWidth,
  cardPadding,
  codeLineHeight,
  editorFontSize,
  editorPadding,
  getSnapshotPadding,
  maxSnapshotWidth,
  minCardWidth,
  minSnapshotHeight,
  minSnapshotWidth,
} from "@sourceshot/core";
import { codeCharAdvanceRatio } from "./fonts.ts";

export type LayoutInput = {
  /** Longest line, in monospace columns. */
  columns: number;
  lines: number;
  /** Stands in for `window.innerWidth` in the browser export. */
  viewport?: number;
  /** Card width ceiling; the browser clips at 1126, the CLI defaults to unbounded. */
  maxCardWidth?: number;
};

export type Layout = {
  width: number;
  height: number;
  cardWidth: number;
  cardHeight: number;
  padding: number;
  /** Columns that actually fit inside the card; the rest are clipped away. */
  visibleColumns: number;
};

const cardInset = cardPadding + cardBorderWidth;

function computeWithPadding(
  {
    columns,
    lines,
    viewport,
    maxCardWidth,
  }: Required<Omit<LayoutInput, "maxCardWidth">> & {
    maxCardWidth?: number;
  },
  padding: number,
): Layout {
  const available = viewport - padding * 2;
  const codeWidth = columns * editorFontSize * codeCharAdvanceRatio;
  const contentWidth = codeWidth + editorPadding * 2 + cardInset * 2;

  const lowerBound = Math.min(minCardWidth, Math.max(available, 0));
  const upperBound = maxCardWidth === undefined ? Infinity : Math.min(available, maxCardWidth);

  const cardWidth = Math.min(Math.max(contentWidth, lowerBound), Math.max(upperBound, lowerBound));
  const cardHeight = lines * codeLineHeight + editorPadding * 2 + cardInset * 2;

  const codeArea = cardWidth - editorPadding * 2 - cardInset * 2;

  return {
    width: Math.ceil(Math.max(minSnapshotWidth, cardWidth + padding * 2)),
    height: Math.ceil(Math.max(minSnapshotHeight, cardHeight + padding * 2)),
    cardWidth: Math.ceil(cardWidth),
    cardHeight: Math.ceil(cardHeight),
    padding,
    visibleColumns: Math.max(1, Math.floor(codeArea / (editorFontSize * codeCharAdvanceRatio))),
  };
}

/**
 * Mirrors the browser's `createSnapshotFrame`: size the frame, and if the resulting
 * width crosses the 560px padding threshold, recompute once with the new padding.
 */
export function computeLayout(input: LayoutInput): Layout {
  const resolved = {
    columns: input.columns,
    lines: input.lines,
    viewport: input.viewport ?? maxSnapshotWidth,
    maxCardWidth: input.maxCardWidth,
  };

  const initialPadding = getSnapshotPadding(
    Math.max(minSnapshotWidth, Math.min(resolved.viewport, maxSnapshotWidth)),
  );
  const first = computeWithPadding(resolved, initialPadding);
  const fittedPadding = getSnapshotPadding(first.width);

  return fittedPadding === initialPadding ? first : computeWithPadding(resolved, fittedPadding);
}
