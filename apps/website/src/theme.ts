import { type AppTheme, isAppTheme, themeOptions } from "./code-options.ts";
import { getThemeDefinition, themeCssVariableNames } from "./theme-definitions.ts";

const themeStorageKey = "sourceshot-theme";

export function getStoredTheme(): AppTheme {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isAppTheme(storedTheme) ? storedTheme : themeOptions[0].value;
  } catch {
    return themeOptions[0].value;
  }
}

export function storeTheme(theme: AppTheme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme persistence is optional; blocked storage should not block the editor.
  }
}

export function applyTheme(theme: AppTheme) {
  applyThemeProperties(document.documentElement, theme);
}

export function applyThemeProperties(element: HTMLElement, theme: AppTheme) {
  const themeDefinition = getThemeDefinition(theme);

  element.dataset.theme = theme;
  element.style.setProperty("color-scheme", themeDefinition.colorScheme);

  for (const variableName of themeCssVariableNames) {
    element.style.setProperty(variableName, themeDefinition.variables[variableName]);
  }
}
