import type { Lang, Theme } from "@pierre/highlights";
import {
  type AppTheme,
  type CodeLanguage,
  type SyntaxLanguage,
  getThemeOption,
} from "./code-options.ts";
import { resolveCodeLanguage } from "./language-detection.ts";
import {
  type CodeThemeDefinition,
  type CodeTokenType,
  customCodeThemes,
} from "./theme-definitions.ts";

export type ThemedToken = {
  content: string;
  offset: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
};

export type TokensResult = { tokens: ThemedToken[][]; fg: string; bg: string };

/**
 * Highlights styles Zed scopes. A scope without an entry inherits from its parent
 * (`keyword.control` from `keyword`), so only roots and the children that land in a
 * different SourceShot category are listed.
 */
const scopeTokenTypes = {
  attribute: "attribute",
  boolean: "boolean",
  comment: "comment",
  constant: "null",
  constructor: "type",
  "diff.minus": "deleted",
  "diff.plus": "inserted",
  embedded: "text",
  emphasis: "text",
  "emphasis.strong": "heading",
  enum: "type",
  function: "function",
  hint: "comment",
  keyword: "keyword",
  // JSDoc tags stay part of their comment.
  "keyword.jsdoc": "comment",
  label: "variable",
  link_text: "string",
  link_uri: "entity",
  namespace: "type",
  number: "number",
  operator: "operator",
  predictive: "comment",
  preproc: "keyword",
  primary: "text",
  property: "property",
  punctuation: "punctuation",
  selector: "tag",
  string: "string",
  "string.escape": "entity",
  "string.regex": "regex",
  tag: "tag",
  text: "text",
  "text.literal": "string",
  title: "heading",
  type: "type",
  "type.jsdoc": "comment",
  variable: "variable",
  "variable.jsdoc": "comment",
  "variable.special": "keyword",
  variant: "null",
} as const satisfies Record<string, CodeTokenType>;

const highlightThemes = new Map<CodeThemeDefinition, Theme>();

/** Translates a SourceShot code theme into the Zed-style theme Highlights consumes. */
function toHighlightTheme(theme: CodeThemeDefinition): Theme {
  let highlightTheme = highlightThemes.get(theme);

  if (!highlightTheme) {
    const syntax = Object.fromEntries(
      Object.entries(scopeTokenTypes).map(([scope, type]) => {
        const { bold, color, italic } = theme.tokens[type];
        return [
          scope,
          { color, font_style: italic ? "italic" : "normal", font_weight: bold ? 700 : 400 },
        ];
      }),
    );

    highlightTheme = {
      name: theme.name,
      appearance: theme.type,
      style: {
        "editor.foreground": theme.foreground,
        "editor.background": theme.background,
        syntax,
      },
    };
    highlightThemes.set(theme, highlightTheme);
  }

  return highlightTheme;
}

/** SourceShot's language values are all Highlights language names. */
function toHighlightLanguage(language: SyntaxLanguage): Lang {
  return language;
}

/** Highlights instantiates its WebAssembly on import, so the website loads it on first use. */
let highlightsPromise: Promise<typeof import("@pierre/highlights")> | undefined;

function getHighlights() {
  highlightsPromise ??= import("@pierre/highlights");
  return highlightsPromise;
}

async function highlight(code: string, language: CodeLanguage, theme: AppTheme) {
  const source = code || " ";
  const { codeToTokens } = await getHighlights();
  const codeTheme = customCodeThemes[getThemeOption(theme).codeTheme];
  const { tokens } = codeToTokens(source, {
    lang: toHighlightLanguage(resolveCodeLanguage(source, language)),
    theme: toHighlightTheme(codeTheme),
  });
  const lines = tokens.map((line) =>
    line.map(({ color, content, fontStyle = 0, offset }): ThemedToken => ({
      content,
      offset,
      color,
      bold: (fontStyle & 2) !== 0,
      italic: (fontStyle & 1) !== 0,
    })),
  );

  return { codeTheme, lines };
}

function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderTokenHtml(token: ThemedToken) {
  const declarations = [
    token.color ? `color:${token.color}` : "",
    token.bold ? "font-weight:bold" : "",
    token.italic ? "font-style:italic" : "",
  ].filter(Boolean);
  const content = escapeHtml(token.content);

  return declarations.length > 0
    ? `<span style="${declarations.join(";")}">${content}</span>`
    : content;
}

export async function renderCodeHtml(code: string, language: CodeLanguage, theme: AppTheme) {
  const { codeTheme, lines } = await highlight(code, language, theme);
  const body = lines.map((line) => line.map(renderTokenHtml).join("")).join("\n");

  return `<pre class="code-highlight" style="color:${codeTheme.foreground}"><code>${body}</code></pre>`;
}

/**
 * Same highlighting as `renderCodeHtml`, but returns the token grid instead of
 * markup. Renderers without an inline formatting context (satori) need this.
 */
export async function renderCodeTokens(
  code: string,
  language: CodeLanguage,
  theme: AppTheme,
): Promise<TokensResult> {
  const { codeTheme, lines } = await highlight(code, language, theme);

  return { tokens: lines, fg: codeTheme.foreground, bg: codeTheme.background };
}
