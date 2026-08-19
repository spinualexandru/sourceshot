import { type ThemedToken, codeTabSize, fontStyleBold, fontStyleItalic } from "@sourceshot/core";

export type CodeSpan = { text: string; color: string; bold: boolean; italic: boolean };
export type CodeLine = { spans: CodeSpan[]; columns: number };

/**
 * East Asian Wide / Fullwidth ranges, which advance two monospace cells. Without
 * these the frame comes out too narrow for CJK-heavy source.
 */
const wideRanges: readonly (readonly [number, number])[] = [
  [0x1100, 0x115f],
  [0x2e80, 0x303e],
  [0x3041, 0x33ff],
  [0x3400, 0x4dbf],
  [0x4e00, 0x9fff],
  [0xa000, 0xa4cf],
  [0xac00, 0xd7a3],
  [0xf900, 0xfaff],
  [0xfe30, 0xfe6f],
  [0xff00, 0xff60],
  [0xffe0, 0xffe6],
  [0x1f300, 0x1f64f],
  [0x1f900, 0x1f9ff],
  [0x20000, 0x2fffd],
];

function charWidth(codePoint: number) {
  return wideRanges.some(([start, end]) => codePoint >= start && codePoint <= end) ? 2 : 1;
}

/**
 * Expands tabs to spaces ourselves rather than relying on satori's `tabSize`, so the
 * measured column count and the rendered text can never disagree.
 *
 * `visible` is the column after the last non-whitespace character, which is what the
 * card is sized against — trailing whitespace is invisible and must not widen it.
 */
function expandTabs(content: string, startColumn: number) {
  let text = "";
  let column = startColumn;
  let visible = 0;

  for (const character of content) {
    if (character === "\t") {
      const width = codeTabSize - (column % codeTabSize);
      text += " ".repeat(width);
      column += width;
      continue;
    }

    text += character;
    column += charWidth(character.codePointAt(0) ?? 0);

    if (!/\s/u.test(character)) {
      visible = column;
    }
  }

  return { text, column, visible };
}

export function toCodeLines(tokens: ThemedToken[][], fallbackColor: string): CodeLine[] {
  return tokens.map((line) => {
    const spans: CodeSpan[] = [];
    let column = 0;
    let visible = 0;

    for (const token of line) {
      const expanded = expandTabs(token.content, column);
      column = expanded.column;

      if (expanded.visible > 0) {
        visible = expanded.visible;
      }

      if (!expanded.text) {
        continue;
      }

      const fontStyle = token.fontStyle ?? 0;
      spans.push({
        text: expanded.text,
        color: token.color ?? fallbackColor,
        bold: (fontStyle & fontStyleBold) !== 0,
        italic: (fontStyle & fontStyleItalic) !== 0,
      });
    }

    return { spans, columns: visible };
  });
}

/**
 * Drops the blank lines a trailing newline leaves behind.
 *
 * Ending a file with a newline is a convention, not content, and rendering the empty
 * line shiki reports for it leaves an unbalanced gap under the last line of code.
 */
export function trimTrailingBlankLines(lines: readonly CodeLine[]): CodeLine[] {
  let end = lines.length;

  while (end > 1 && lines[end - 1].columns === 0) {
    end -= 1;
  }

  return lines.slice(0, end);
}

export function maxColumns(lines: readonly CodeLine[]) {
  return lines.reduce((widest, line) => Math.max(widest, line.columns), 0);
}

/**
 * Drops the part of each line that falls outside the card.
 *
 * Overflowing text is invisible behind the card's `overflow: hidden`, and emitting it
 * anyway both bloats the SVG with unused glyph outlines and pushes resvg into a
 * geometry panic once the overhang gets large enough.
 */
export function clipLines(lines: readonly CodeLine[], limit: number): CodeLine[] {
  if (!Number.isFinite(limit)) {
    return [...lines];
  }

  // A couple of columns of slack keeps the partially visible glyph at the edge.
  const budget = Math.max(1, Math.ceil(limit) + 2);

  return lines.map((line) => {
    if (line.columns <= budget) {
      return line;
    }

    const spans: CodeSpan[] = [];
    let column = 0;

    for (const span of line.spans) {
      if (column >= budget) {
        break;
      }

      const remaining = budget - column;
      const characters = Array.from(span.text);
      const text = characters.slice(0, remaining).join("");
      spans.push({ ...span, text });
      column += characters.length;
    }

    return { spans, columns: Math.min(line.columns, budget) };
  });
}
