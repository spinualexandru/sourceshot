import type { Language, Token } from "@vortexlabs/kirari/core";
import {
  type AppTheme,
  type CodeLanguage,
  type SyntaxLanguage,
  getThemeOption,
} from "./code-options.ts";
import { resolveCodeLanguage } from "./language-detection.ts";
import {
  type CodeThemeDefinition,
  type CodeTokenStyle,
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

let fencedMarkdownPromise: Promise<Language> | undefined;

/**
 * Markdown highlights fenced code (```ts, ```py, ...) in its own language. Fence tags can
 * name any grammar, so this loads them all, but only when Markdown is being rendered.
 * Unknown or untagged fences stay a single string token.
 */
function getFencedMarkdown() {
  fencedMarkdownPromise ??= Promise.all([
    import("@vortexlabs/kirari/languages"),
    import("@vortexlabs/kirari/registry"),
    import("@vortexlabs/kirari/markdown"),
  ]).then(([languages, { createRegistry }, { createMarkdown }]) =>
    createMarkdown(createRegistry(Object.values(languages))),
  );
  return fencedMarkdownPromise;
}

/** One dynamic import per grammar, so the website only fetches the language it renders. */
const languageLoaders: Record<SyntaxLanguage, () => Promise<Language>> = {
  c: () => import("@vortexlabs/kirari/languages/c").then((module) => module.c),
  clojure: () => import("@vortexlabs/kirari/languages/clojure").then((module) => module.clojure),
  cpp: () => import("@vortexlabs/kirari/languages/cpp").then((module) => module.cpp),
  csharp: () => import("@vortexlabs/kirari/languages/csharp").then((module) => module.csharp),
  css: () => import("@vortexlabs/kirari/languages/css").then((module) => module.css),
  dart: () => import("@vortexlabs/kirari/languages/dart").then((module) => module.dart),
  diff: () => import("@vortexlabs/kirari/languages/diff").then((module) => module.diff),
  dockerfile: () =>
    import("@vortexlabs/kirari/languages/dockerfile").then((module) => module.dockerfile),
  dotenv: () => import("@vortexlabs/kirari/languages/dotenv").then((module) => module.dotenv),
  elixir: () => import("@vortexlabs/kirari/languages/elixir").then((module) => module.elixir),
  glsl: () => import("@vortexlabs/kirari/languages/glsl").then((module) => module.glsl),
  go: () => import("@vortexlabs/kirari/languages/go").then((module) => module.go),
  graphql: () => import("@vortexlabs/kirari/languages/graphql").then((module) => module.graphql),
  groovy: () => import("@vortexlabs/kirari/languages/groovy").then((module) => module.groovy),
  hcl: () => import("@vortexlabs/kirari/languages/hcl").then((module) => module.hcl),
  html: () => import("@vortexlabs/kirari/languages/html").then((module) => module.html),
  ini: () => import("@vortexlabs/kirari/languages/ini").then((module) => module.ini),
  java: () => import("@vortexlabs/kirari/languages/java").then((module) => module.java),
  javascript: () =>
    import("@vortexlabs/kirari/languages/javascript").then((module) => module.javascript),
  json: () => import("@vortexlabs/kirari/languages/json").then((module) => module.json),
  jsonc: () => import("@vortexlabs/kirari/languages/jsonc").then((module) => module.jsonc),
  jsx: () => import("@vortexlabs/kirari/languages/jsx").then((module) => module.jsx),
  julia: () => import("@vortexlabs/kirari/languages/julia").then((module) => module.julia),
  kotlin: () => import("@vortexlabs/kirari/languages/kotlin").then((module) => module.kotlin),
  lua: () => import("@vortexlabs/kirari/languages/lua").then((module) => module.lua),
  makefile: () => import("@vortexlabs/kirari/languages/makefile").then((module) => module.makefile),
  markdown: () => getFencedMarkdown(),
  nginx: () => import("@vortexlabs/kirari/languages/nginx").then((module) => module.nginx),
  php: () => import("@vortexlabs/kirari/languages/php").then((module) => module.php),
  plaintext: () =>
    import("@vortexlabs/kirari/languages/plaintext").then((module) => module.plaintext),
  powershell: () =>
    import("@vortexlabs/kirari/languages/powershell").then((module) => module.powershell),
  protobuf: () => import("@vortexlabs/kirari/languages/protobuf").then((module) => module.protobuf),
  python: () => import("@vortexlabs/kirari/languages/python").then((module) => module.python),
  r: () => import("@vortexlabs/kirari/languages/r").then((module) => module.r),
  ruby: () => import("@vortexlabs/kirari/languages/ruby").then((module) => module.ruby),
  rust: () => import("@vortexlabs/kirari/languages/rust").then((module) => module.rust),
  scala: () => import("@vortexlabs/kirari/languages/scala").then((module) => module.scala),
  shell: () => import("@vortexlabs/kirari/languages/shell").then((module) => module.shell),
  sql: () => import("@vortexlabs/kirari/languages/sql").then((module) => module.sql),
  svelte: () => import("@vortexlabs/kirari/languages/svelte").then((module) => module.svelte),
  swift: () => import("@vortexlabs/kirari/languages/swift").then((module) => module.swift),
  toml: () => import("@vortexlabs/kirari/languages/toml").then((module) => module.toml),
  tsx: () => import("@vortexlabs/kirari/languages/tsx").then((module) => module.tsx),
  typescript: () =>
    import("@vortexlabs/kirari/languages/typescript").then((module) => module.typescript),
  vue: () => import("@vortexlabs/kirari/languages/vue").then((module) => module.vue),
  xml: () => import("@vortexlabs/kirari/languages/xml").then((module) => module.xml),
  yaml: () => import("@vortexlabs/kirari/languages/yaml").then((module) => module.yaml),
  zig: () => import("@vortexlabs/kirari/languages/zig").then((module) => module.zig),
};

let tokenizePromise: Promise<(source: string, language: Language) => Token[]> | undefined;

function getTokenize() {
  tokenizePromise ??= import("@vortexlabs/kirari/core").then((module) => module.tokenize);
  return tokenizePromise;
}

function tokenStyle(theme: CodeThemeDefinition, type: string): CodeTokenStyle | undefined {
  return Object.hasOwn(theme.tokens, type)
    ? theme.tokens[type as keyof CodeThemeDefinition["tokens"]]
    : undefined;
}

/**
 * Kirari returns one flat token list, and a block comment or template string is a
 * single token spanning several lines. Renderers lay out line by line, so split every
 * token at its newlines.
 */
function toThemedLines(tokens: readonly Token[], theme: CodeThemeDefinition) {
  const lines: ThemedToken[][] = [[]];

  for (const token of tokens) {
    const style = tokenStyle(theme, token.type);
    const parts = token.value.split("\n");
    let offset = token.start;

    parts.forEach((content, index) => {
      if (index > 0) {
        lines.push([]);
        offset += 1;
      }

      if (content) {
        lines[lines.length - 1].push({
          content,
          offset,
          color: style?.color,
          bold: style?.bold,
          italic: style?.italic,
        });
      }

      offset += content.length;
    });
  }

  return lines;
}

async function highlight(code: string, language: CodeLanguage, theme: AppTheme) {
  const source = code || " ";
  const [tokenize, grammar] = await Promise.all([
    getTokenize(),
    languageLoaders[resolveCodeLanguage(source, language)](),
  ]);
  const codeTheme = customCodeThemes[getThemeOption(theme).codeTheme];

  return { codeTheme, lines: toThemedLines(tokenize(source, grammar), codeTheme) };
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
