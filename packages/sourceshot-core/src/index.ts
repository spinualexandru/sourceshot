export {
  type AppTheme,
  type CodeLanguage,
  type CodeTheme,
  type LanguageOption,
  type SyntaxLanguage,
  type ThemeOption,
  defaultTheme,
  getThemeOption,
  isAppTheme,
  isCodeLanguage,
  languageOptions,
  syntaxLanguageOptions,
  themeOptions,
} from "./code-options.ts";

export { detectCodeLanguage, resolveCodeLanguage } from "./language-detection.ts";

export {
  type AppThemeDefinition,
  type AppThemeValue,
  type CodeThemeName,
  type ThemeCssVariables,
  appThemeDefinitions,
  customCodeThemes,
  getThemeDefinition,
  themeCssVariableNames,
} from "./theme-definitions.ts";

export {
  type ThemedToken,
  type TokensResult,
  fontStyleBold,
  fontStyleItalic,
  fontStyleUnderline,
  renderCodeHtml,
  renderCodeTokens,
} from "./code-highlight.ts";

export {
  cardBorderRadius,
  cardBorderWidth,
  cardPadding,
  codeLineHeight,
  codeTabSize,
  editorFontSize,
  editorLineHeight,
  editorPadding,
  getSnapshotPadding,
  getSnapshotPixelRatio,
  maxCardWidth,
  maxSnapshotWidth,
  minCardWidth,
  minSnapshotHeight,
  minSnapshotWidth,
} from "./snapshot-metrics.ts";
