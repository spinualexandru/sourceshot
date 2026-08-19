/**
 * Geometry shared by every SourceShot renderer.
 *
 * The browser export measures the real DOM, while the CLI computes the same numbers
 * analytically. Keeping the constants here is what stops the two from drifting; the
 * website's `style.css` still owns the actual styling.
 */

export const maxSnapshotWidth = 1280;
export const minSnapshotWidth = 320;
export const minSnapshotHeight = 220;

export const minCardWidth = 520;
export const maxCardWidth = 1126;

export const cardBorderRadius = 32;
export const cardBorderWidth = 6;
export const cardPadding = 24;

export const editorPadding = 18;
export const editorFontSize = 16;
export const editorLineHeight = 1.55;
export const codeTabSize = 2;

/** Height of a single rendered code line, in CSS pixels. */
export const codeLineHeight = editorFontSize * editorLineHeight;

/** Distance between the frame edge and the code card. */
export function getSnapshotPadding(width: number) {
  return width <= 560 ? 28 : 64;
}

/**
 * Device pixel ratio for the snapshot, capped so the result stays inside the
 * browser's canvas limits (8192px per side, ~24MP total).
 */
export function getSnapshotPixelRatio(width: number, height: number) {
  const highQualityRatio = 2;
  const maxCanvasDimension = 8192;
  const maxCanvasArea = 24_000_000;
  const dimensionRatio = Math.min(maxCanvasDimension / width, maxCanvasDimension / height);
  const areaRatio = Math.sqrt(maxCanvasArea / (width * height));

  return Math.max(1, Math.min(highQualityRatio, dimensionRatio, areaRatio));
}
