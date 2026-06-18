import { type AppTheme, getThemeOption, themeOptions } from "../code-options.ts";
import html from "../lib/highlighter.ts";
import { renderToolDropdown, renderToolOption } from "./tool-dropdown.ts";

function renderThemeOptions(selectedTheme: AppTheme) {
  return themeOptions
    .map((theme) =>
      renderToolOption({
        dataAttribute: "data-theme",
        label: theme.label,
        selected: theme.value === selectedTheme,
        value: theme.value,
      }),
    )
    .join("");
}

export function renderThemeSwitcher(selectedTheme: AppTheme) {
  return html`
    <div class="theme-switcher" aria-label="Theme selector">
      ${renderToolDropdown({
        buttonClassName: "theme-switcher__button",
        dropdownName: "theme",
        label: getThemeOption(selectedTheme).label,
        labelDataAttribute: "data-theme-label",
        listboxLabel: "Themes",
        optionsHtml: renderThemeOptions(selectedTheme),
      })}
    </div>
  `;
}
