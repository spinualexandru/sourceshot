import {
  type AppTheme,
  type CodeLanguage,
  type CodeTheme,
  type SyntaxLanguage,
  getThemeOption,
} from "./code-options.ts";
import { resolveCodeLanguage } from "./language-detection.ts";

const darkPunctuationColor = "#A8B0BD";

let shikiPromise:
  | Promise<{
      codeToHtml: (
        code: string,
        options: { lang: SyntaxLanguage; theme: CodeTheme },
      ) => Promise<string>;
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
          "vitesse-dark": () => import("shiki/dist/themes/vitesse-dark.mjs"),
          "vitesse-light": () => import("shiki/dist/themes/vitesse-light.mjs"),
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

  if (theme !== "dark") {
    return html;
  }

  return html.replaceAll("color:#666666", `color:${darkPunctuationColor}`);
}
