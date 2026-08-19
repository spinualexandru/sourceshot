import {
  type AppTheme,
  defaultTheme,
  getThemeDefinition,
  isAppTheme,
  themeCssVariableNames,
} from "@sourceshot/core";

const themeStorageKey = "sourceshot-theme";

export function getStoredTheme(): AppTheme {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isAppTheme(storedTheme) ? storedTheme : defaultTheme;
  } catch {
    return defaultTheme;
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
