import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { type AppTheme, defaultTheme, getThemeOption, themeOptions } from "../code-options.ts";
import "./tool-dropdown.ts";
import type { ToolDropdownOption, ToolDropdownSelectEvent } from "./tool-dropdown.ts";

export type ThemeSwitcherChangeEvent = CustomEvent<{
  theme: AppTheme;
}>;

@customElement("theme-switcher")
export class ThemeSwitcher extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 20;
      top: max(22px, env(safe-area-inset-top));
      right: max(22px, env(safe-area-inset-right));
      display: flex;
      box-sizing: border-box;
      padding: 8px;
      border-radius: 999px;
      background-color: color-mix(in srgb, var(--glass) 18%, transparent);
      backdrop-filter: blur(12px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(12px) saturate(var(--glass-saturation));
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 14%), transparent),
        inset 1.8px 3px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 88%), transparent),
        inset -2px -2px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 76%), transparent),
        inset -3px -8px 1px -6px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 58%), transparent),
        inset -0.3px -1px 4px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
        inset -1.5px 2.5px 0 -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
        inset 0 3px 4px -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
        inset 2px -6.5px 1px -4px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 1px 5px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 18px 44px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 16%), transparent);
      font: inherit;
      color: inherit;
    }

    @media (max-width: 560px) {
      :host {
        top: 14px;
        right: 14px;
      }
    }
  `;

  @property({ type: Boolean })
  open = false;

  @property({ type: String, attribute: "selected-theme" })
  selectedTheme: AppTheme = defaultTheme;

  private get themeDropdownOptions(): ToolDropdownOption[] {
    return themeOptions.map((theme) => ({
      label: theme.label,
      selected: theme.value === this.selectedTheme,
      value: theme.value,
    }));
  }

  private readonly handleThemeSelect = (event: ToolDropdownSelectEvent) => {
    const theme = themeOptions.find((option) => option.value === event.detail.value);

    if (!theme) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("theme-change", {
        bubbles: true,
        composed: true,
        detail: { theme: theme.value },
      }) satisfies ThemeSwitcherChangeEvent,
    );
  };

  protected override render() {
    return html`
      <tool-dropdown
        button-class-name="theme-switcher__button"
        dropdown-name="theme"
        label=${getThemeOption(this.selectedTheme).label}
        label-data-attribute="data-theme-label"
        listbox-label="Themes"
        option-data-attribute="data-theme"
        placement="below"
        .open=${this.open}
        .options=${this.themeDropdownOptions}
        @tool-dropdown-select=${this.handleThemeSelect}
      ></tool-dropdown>
    `;
  }
}
