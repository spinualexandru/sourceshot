import { type AppTheme, type LanguageOption } from "../code-options.ts";
import html from "../lib/highlighter.ts";
import { renderCodeWindow } from "./code-window.ts";
import { renderThemeSwitcher } from "./theme-switcher.ts";
import { renderToolIsland } from "./tool-island.ts";

export function renderEditorChrome(selectedLanguage: LanguageOption, selectedTheme: AppTheme) {
  return html`
    ${renderCodeWindow()} ${renderThemeSwitcher(selectedTheme)}
    ${renderToolIsland(selectedLanguage)}
  `;
}
