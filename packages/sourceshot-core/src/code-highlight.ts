import type { ThemedToken, TokensResult } from "shiki/core";

export type { ThemedToken, TokensResult };
import {
  type AppTheme,
  type CodeLanguage,
  type CodeTheme,
  type SyntaxLanguage,
  getThemeOption,
} from "./code-options.ts";
import { resolveCodeLanguage } from "./language-detection.ts";
import { customCodeThemes } from "./theme-definitions.ts";

/**
 * Shiki's `FontStyle` is a `declare const enum`, which cannot be imported as a value
 * under `isolatedModules`/`verbatimModuleSyntax`. These mirror its bit flags.
 */
export const fontStyleItalic = 1;
export const fontStyleBold = 2;
export const fontStyleUnderline = 4;

type HighlightOptions = { lang: SyntaxLanguage; theme: CodeTheme };

let shikiPromise:
  | Promise<{
      codeToHtml: (code: string, options: HighlightOptions) => Promise<string>;
      codeToTokens: (code: string, options: HighlightOptions) => Promise<TokensResult>;
    }>
  | undefined;

async function getShiki() {
  shikiPromise ??= Promise.all([import("shiki/core"), import("shiki/engine/javascript")]).then(
    ([
      { createBundledHighlighter, createSingletonShorthands },
      { createJavaScriptRegexEngine },
    ]) => {
      const createHighlighter = createBundledHighlighter<SyntaxLanguage, CodeTheme>({
        engine: createJavaScriptRegexEngine,
        langs: {
          css: () => import("shiki/dist/langs/css.mjs"),
          go: () => import("shiki/dist/langs/go.mjs"),
          html: () => import("shiki/dist/langs/html.mjs"),
          javascript: () => import("shiki/dist/langs/javascript.mjs"),
          json: () => import("shiki/dist/langs/json.mjs"),
          jsx: () => import("shiki/dist/langs/jsx.mjs"),
          markdown: () => import("shiki/dist/langs/markdown.mjs"),
          python: () => import("shiki/dist/langs/python.mjs"),
          rust: () => import("shiki/dist/langs/rust.mjs"),
          tsx: () => import("shiki/dist/langs/tsx.mjs"),
          typescript: () => import("shiki/dist/langs/typescript.mjs"),
        },
        themes: {
          ...customCodeThemes,
        },
      });

      return createSingletonShorthands(createHighlighter);
    },
  );
  return shikiPromise;
}

export async function renderCodeHtml(code: string, language: CodeLanguage, theme: AppTheme) {
  const { codeToHtml } = await getShiki();
  const html = await codeToHtml(code || " ", {
    lang: resolveCodeLanguage(code, language),
    theme: getThemeOption(theme).codeTheme,
  });

  return html;
}

/**
 * Same highlighting as `renderCodeHtml`, but returns shiki's token grid instead of
 * markup. Renderers without an inline formatting context (satori) need this.
 */
export async function renderCodeTokens(code: string, language: CodeLanguage, theme: AppTheme) {
  const { codeToTokens } = await getShiki();

  return await codeToTokens(code || " ", {
    lang: resolveCodeLanguage(code, language),
    theme: getThemeOption(theme).codeTheme,
  });
}
