import { describe, expect, it } from "vite-plus/test";
import { clipLines, maxColumns, toCodeLines, trimTrailingBlankLines } from "./code-lines.ts";

const plain = (content: string) => [[{ content, offset: 0 }]];

describe("toCodeLines", () => {
  it("expands a leading tab to the next tab stop", () => {
    const [line] = toCodeLines(plain("\tab"), "#000");

    expect(line.spans[0].text).toBe("  ab");
    expect(line.columns).toBe(4);
  });

  it("advances a tab only to the next stop, not a full width", () => {
    const [line] = toCodeLines(plain("a\tb"), "#000");

    expect(line.spans[0].text).toBe("a b");
    expect(line.columns).toBe(3);
  });

  it("falls back to the theme foreground when a token has no colour", () => {
    const [line] = toCodeLines(plain("x"), "#123456");

    expect(line.spans[0].color).toBe("#123456");
  });

  it("counts wide characters as two columns", () => {
    const [line] = toCodeLines(plain("日本"), "#000");

    expect(line.columns).toBe(4);
  });

  it("counts an astral character as a single column", () => {
    const [line] = toCodeLines(plain("𝄞"), "#000");

    expect(line.columns).toBe(1);
  });

  it("maps shiki font style bits onto bold and italic", () => {
    const [line] = toCodeLines([[{ content: "k", offset: 0, fontStyle: 3 as never }]], "#000");

    expect(line.spans[0]).toMatchObject({ bold: true, italic: true });
  });
});

describe("trailing whitespace", () => {
  it("does not count trailing spaces towards the width", () => {
    const [padded] = toCodeLines(plain("abc   "), "#000");
    const [bare] = toCodeLines(plain("abc"), "#000");

    expect(padded.columns).toBe(bare.columns);
  });

  it("does not count a trailing tab towards the width", () => {
    expect(toCodeLines(plain("abc\t"), "#000")[0].columns).toBe(3);
  });

  it("reports a whitespace-only line as empty", () => {
    expect(toCodeLines(plain("    "), "#000")[0].columns).toBe(0);
  });

  it("still counts interior whitespace", () => {
    expect(toCodeLines(plain("a   b"), "#000")[0].columns).toBe(5);
  });

  it("keeps leading indentation in the width", () => {
    expect(toCodeLines(plain("    x"), "#000")[0].columns).toBe(5);
  });
});

describe("trimTrailingBlankLines", () => {
  it("drops the empty line left by a trailing newline", () => {
    const lines = toCodeLines([...plain("code"), []], "#000");

    expect(trimTrailingBlankLines(lines)).toHaveLength(1);
  });

  it("drops several trailing blank lines", () => {
    const lines = toCodeLines([...plain("code"), [], [], []], "#000");

    expect(trimTrailingBlankLines(lines)).toHaveLength(1);
  });

  it("preserves blank lines between code", () => {
    const lines = toCodeLines([...plain("a"), [], ...plain("b")], "#000");

    expect(trimTrailingBlankLines(lines)).toHaveLength(3);
  });

  it("keeps one line when everything is blank", () => {
    expect(trimTrailingBlankLines(toCodeLines([[], []], "#000"))).toHaveLength(1);
  });
});

describe("clipLines", () => {
  it("leaves lines that fit untouched", () => {
    const lines = toCodeLines(plain("short"), "#000");

    expect(clipLines(lines, 40)).toEqual(lines);
  });

  it("truncates lines past the visible column budget", () => {
    const lines = toCodeLines(plain("y".repeat(200)), "#000");
    const [clipped] = clipLines(lines, 50);

    expect(clipped.columns).toBeLessThanOrEqual(52);
    expect(clipped.spans[0].text.length).toBeLessThanOrEqual(52);
  });

  it("keeps every line when the budget is unbounded", () => {
    const lines = toCodeLines(plain("y".repeat(200)), "#000");

    expect(clipLines(lines, Infinity)).toEqual(lines);
  });
});

describe("maxColumns", () => {
  it("returns the widest line", () => {
    expect(
      maxColumns(toCodeLines([...plain("ab"), [{ content: "abcd", offset: 0 }]], "#000")),
    ).toBe(4);
  });
});
