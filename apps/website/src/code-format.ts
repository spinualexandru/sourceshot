import type { Options, Plugin } from "prettier";
import { type CodeLanguage, type SyntaxLanguage } from "./code-options.ts";
import { resolveCodeLanguage } from "./language-detection.ts";

type FormatResult = {
  code: string;
  cursorOffset: number;
  formatted: boolean;
};

type FormatterConfig = {
  loadPlugins: () => Promise<Plugin[]>;
  parser: Options["parser"];
};

let htmlPlugins: Promise<Plugin[]> | undefined;
let javascriptPlugins: Promise<Plugin[]> | undefined;
let markdownPlugins: Promise<Plugin[]> | undefined;
let postcssPlugins: Promise<Plugin[]> | undefined;
let typescriptPlugins: Promise<Plugin[]> | undefined;

function loadHtmlPlugins() {
  htmlPlugins ??= import("prettier/plugins/html").then((plugin) => [plugin]);
  return htmlPlugins;
}

function loadJavascriptPlugins() {
  javascriptPlugins ??= Promise.all([
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
  ]);
  return javascriptPlugins;
}

function loadMarkdownPlugins() {
  markdownPlugins ??= import("prettier/plugins/markdown").then((plugin) => [plugin]);
  return markdownPlugins;
}

function loadPostcssPlugins() {
  postcssPlugins ??= import("prettier/plugins/postcss").then((plugin) => [plugin]);
  return postcssPlugins;
}

function loadTypescriptPlugins() {
  typescriptPlugins ??= Promise.all([
    import("prettier/plugins/typescript"),
    import("prettier/plugins/estree"),
  ]);
  return typescriptPlugins;
}

const formatterConfigs: Partial<Record<SyntaxLanguage, FormatterConfig>> = {
  css: { loadPlugins: loadPostcssPlugins, parser: "css" },
  html: { loadPlugins: loadHtmlPlugins, parser: "html" },
  javascript: { loadPlugins: loadJavascriptPlugins, parser: "babel" },
  json: { loadPlugins: loadJavascriptPlugins, parser: "json" },
  jsx: { loadPlugins: loadJavascriptPlugins, parser: "babel" },
  markdown: { loadPlugins: loadMarkdownPlugins, parser: "markdown" },
  tsx: { loadPlugins: loadTypescriptPlugins, parser: "typescript" },
  typescript: { loadPlugins: loadTypescriptPlugins, parser: "typescript" },
};

export async function formatCode(
  code: string,
  language: CodeLanguage,
  cursorOffset: number,
): Promise<FormatResult> {
  const resolvedLanguage = resolveCodeLanguage(code, language);
  const config = formatterConfigs[resolvedLanguage];

  if (!config) {
    return { code, cursorOffset, formatted: false };
  }

  const [{ formatWithCursor }, plugins] = await Promise.all([
    import("prettier/standalone"),
    config.loadPlugins(),
  ]);

  const result = await formatWithCursor(code, {
    cursorOffset,
    parser: config.parser,
    plugins,
    printWidth: 96,
    tabWidth: 2,
  });

  return {
    code: result.formatted,
    cursorOffset: result.cursorOffset,
    formatted: result.formatted !== code,
  };
}
