import { Search, X, createElement, type IconNode } from "lucide";
import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export type ToolDropdownOption = {
  label: string;
  selected: boolean;
  value: string;
};

export type ToolDropdownSelectEvent = CustomEvent<{
  dropdownName: string;
  value: string;
}>;

export type ToolDropdownToggleEvent = CustomEvent<{
  dropdownName: string;
}>;

@customElement("tool-dropdown")
export class ToolDropdown extends LitElement {
  static styles = css`
    :host {
      display: flex;
      min-width: 0;
      font: inherit;
      color: inherit;
    }

    .tool-island__dropdown {
      position: relative;
      display: flex;
      min-width: 0;
      width: 100%;
    }

    .tool-island__button,
    .theme-switcher__button {
      appearance: none;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 104px;
      height: 48px;
      box-sizing: border-box;
      border: 0;
      border-radius: 999px;
      padding: 0 18px;
      color: var(--text-h);
      background-color: color-mix(in srgb, var(--glass) 34%, transparent);
      font: 700 14px/1 var(--sans);
      letter-spacing: 0;
      white-space: nowrap;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 12%), transparent),
        inset 2px 1px 0 -1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 88%), transparent),
        inset -1.5px -1px 0 -1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 72%), transparent),
        inset -2px -6px 1px -5px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 56%), transparent),
        inset -1px 2px 3px -1px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 18%), transparent),
        inset 0 -4px 1px -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 3px 6px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
      transition:
        background-color 180ms ease,
        box-shadow 180ms ease,
        color 180ms ease,
        transform 180ms ease;
    }

    .tool-island__button:hover,
    .theme-switcher__button:hover {
      color: var(--accent);
      background-color: color-mix(in srgb, var(--glass) 42%, transparent);
      transform: translateY(-1px);
    }

    .tool-island__button:focus-visible,
    .theme-switcher__button:focus-visible,
    .tool-island__option:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent) 82%, white);
      outline-offset: 3px;
    }

    .tool-island__select {
      min-width: 156px;
      justify-content: space-between;
      gap: 14px;
    }

    .tool-island__select-content {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .tool-island__icon {
      display: block;
      flex: 0 0 17px;
      width: 17px;
      height: 17px;
      pointer-events: none;
      stroke-width: 2.25;
    }

    .tool-island__label {
      min-width: 0;
      overflow: hidden;
      line-height: 1.25;
      text-overflow: ellipsis;
    }

    .tool-island__select::after {
      content: "";
      display: block;
      flex: 0 0 auto;
      width: 7px;
      height: 7px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      rotate: 45deg;
      translate: 0 -2px;
      transition:
        rotate 180ms ease,
        translate 180ms ease;
    }

    .tool-island__dropdown.is-open .tool-island__select::after {
      rotate: 225deg;
      translate: 0 2px;
    }

    .tool-island__menu {
      position: absolute;
      isolation: isolate;
      right: 0;
      bottom: calc(100% + 12px);
      display: flex;
      flex-direction: column;
      width: max-content;
      min-width: 188px;
      max-width: calc(100vw - 48px);
      max-height: min(360px, calc(100svh - 136px));
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 24px;
      background-color: color-mix(in srgb, var(--glass) 22%, transparent);
      backdrop-filter: blur(34px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(34px) saturate(var(--glass-saturation));
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 16%), transparent),
        inset 1.5px 2px 0 -1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 70%), transparent),
        inset -2px -6px 1px -5px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 46%), transparent),
        inset -1px 2px 3px -1px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 16%), transparent),
        0 18px 38px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 16%), transparent);
      opacity: 0;
      /* Hidden, not just transparent, so a closed menu's options leave the tab order. */
      visibility: hidden;
      pointer-events: none;
      transform: translateY(8px) scale(0.98);
      transform-origin: bottom right;
      transition:
        opacity 160ms ease,
        transform 160ms ease,
        visibility 0s linear 160ms;
    }

    .tool-island__menu-scroll {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 4px;
      flex: 1 1 auto;
      min-height: 0;
      box-sizing: border-box;
      padding: 8px;
      overflow: auto;
      border-radius: inherit;
    }

    .tool-island__menu-options {
      display: grid;
      gap: 4px;
    }

    .tool-island__menu-search {
      position: relative;
      z-index: 1;
      display: block;
      flex: 0 0 auto;
      padding: 8px 8px 0;
    }

    .tool-island__search-input {
      appearance: none;
      display: block;
      width: 100%;
      height: 38px;
      box-sizing: border-box;
      border: 0;
      border-radius: 999px;
      padding: 0 34px;
      color: var(--text-h);
      background-color: color-mix(in srgb, var(--glass) 42%, transparent);
      font: 650 14px/1 var(--sans);
      letter-spacing: 0;
      outline: none;
      box-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 16%), transparent);
    }

    .tool-island__search-input::placeholder {
      color: var(--text);
    }

    .tool-island__search-input:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent) 82%, white);
      outline-offset: 3px;
    }

    .tool-island__search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      width: 15px;
      height: 15px;
      color: var(--text);
      pointer-events: none;
      stroke-width: 2.25;
      translate: 0 -50%;
    }

    .tool-island__search-clear {
      appearance: none;
      position: absolute;
      right: 5px;
      top: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      box-sizing: border-box;
      border: 0;
      border-radius: 999px;
      padding: 0;
      color: var(--text);
      background: transparent;
      cursor: pointer;
      translate: 0 -50%;
      transition:
        background-color 140ms ease,
        color 140ms ease;
    }

    .tool-island__search-clear:hover {
      color: var(--accent);
      background-color: color-mix(in srgb, var(--glass) 42%, transparent);
    }

    .tool-island__search-clear:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent) 82%, white);
      outline-offset: 3px;
    }

    .tool-island__search-clear-icon {
      display: block;
      width: 13px;
      height: 13px;
      stroke-width: 2.25;
    }

    .tool-island__menu-empty {
      display: flex;
      align-items: center;
      min-height: 38px;
      padding: 0 12px;
      color: var(--text);
      font: 650 14px/1.25 var(--sans);
      letter-spacing: 0;
    }

    .tool-island__menu::before {
      content: "";
      position: absolute;
      z-index: 0;
      inset: 0;
      box-sizing: border-box;
      border: 8px solid transparent;
      border-radius: inherit;
      pointer-events: none;
      backdrop-filter: blur(48px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(48px) saturate(var(--glass-saturation));
      -webkit-mask:
        linear-gradient(black, black) border-box,
        linear-gradient(black, black) padding-box;
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(black, black) border-box,
        linear-gradient(black, black) padding-box;
      mask-composite: subtract;
    }

    .tool-island__dropdown.is-open .tool-island__menu {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
      transition-delay: 0s;
    }

    :host([placement="below"]) .tool-island__menu {
      top: calc(100% + 12px);
      bottom: auto;
      transform: translateY(-8px) scale(0.98);
      transform-origin: top right;
    }

    :host([placement="below"]) .tool-island__dropdown.is-open .tool-island__menu {
      transform: translateY(0) scale(1);
    }

    .tool-island__option {
      appearance: none;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 38px;
      width: 100%;
      box-sizing: border-box;
      border: 0;
      border-radius: 18px;
      padding: 0 12px;
      color: var(--text-h);
      background: transparent;
      font: 650 14px/1 var(--sans);
      letter-spacing: 0;
      cursor: pointer;
      text-align: left;
      transition:
        background-color 140ms ease,
        color 140ms ease;
    }

    .tool-island__option:hover,
    .tool-island__option[aria-selected="true"] {
      color: var(--accent);
      background-color: color-mix(in srgb, var(--glass) 42%, transparent);
    }

    .tool-island__option[aria-selected="true"]::after {
      content: "";
      width: 6px;
      height: 12px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      rotate: 45deg;
    }

    @media (max-width: 560px) {
      .tool-island__button {
        flex: 1 1 0;
        min-width: 0;
        width: 100%;
        padding: 0 14px;
      }

      .tool-island__select {
        min-width: 0;
      }

      /* Right-aligned like on desktop: centring it on the rightmost tool pushed it off-screen. */
      .tool-island__menu {
        width: min(260px, calc(100vw - 48px));
      }

      :host([placement="below"]) .tool-island__menu,
      :host([placement="below"]) .tool-island__dropdown.is-open .tool-island__menu {
        right: 0;
        transform: translateY(0) scale(1);
        transform-origin: top right;
      }
    }
  `;

  @property({ type: String, attribute: "button-class-name" })
  buttonClassName = "tool-island__button";

  @property({ type: String, attribute: "dropdown-name" })
  dropdownName = "";

  @property({ type: String })
  label = "";

  @property({ attribute: false })
  icon?: IconNode;

  @property({ type: String, attribute: "label-data-attribute" })
  labelDataAttribute = "";

  @property({ type: String, attribute: "listbox-label" })
  listboxLabel = "";

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, attribute: "option-data-attribute" })
  optionDataAttribute = "";

  @property({ attribute: false })
  options: ToolDropdownOption[] = [];

  @property({ type: Boolean })
  searchable = false;

  @property({ type: String, attribute: "search-placeholder" })
  searchPlaceholder = "Search…";

  @property({ type: String, reflect: true })
  placement: "above" | "below" = "above";

  @state()
  private searchQuery = "";

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("open") && !this.open) {
      this.searchQuery = "";
    }
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    if (!this.searchable || !changedProperties.has("open") || !this.open) {
      return;
    }

    this.renderRoot.querySelector<HTMLInputElement>(".tool-island__search-input")?.focus({
      preventScroll: true,
    });
  }

  private get filteredOptions(): ToolDropdownOption[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!this.searchable || !query) {
      return this.options;
    }

    return this.options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
    );
  }

  private readonly handleSearchInput = (event: Event) => {
    this.searchQuery = (event.currentTarget as HTMLInputElement).value;
  };

  private readonly handleSearchKeydown = (event: KeyboardEvent) => {
    // Let the first Escape clear the filter; the next one closes the menu.
    if (event.key === "Escape" && this.searchQuery) {
      event.stopPropagation();
      this.clearSearch();
    }
  };

  private readonly clearSearch = () => {
    this.searchQuery = "";

    this.renderRoot.querySelector<HTMLInputElement>(".tool-island__search-input")?.focus({
      preventScroll: true,
    });
  };

  private readonly emitToggle = () => {
    this.dispatchEvent(
      new CustomEvent("tool-dropdown-toggle", {
        bubbles: true,
        composed: true,
        detail: { dropdownName: this.dropdownName },
      }) satisfies ToolDropdownToggleEvent,
    );
  };

  private emitSelection(value: string) {
    this.dispatchEvent(
      new CustomEvent("tool-dropdown-select", {
        bubbles: true,
        composed: true,
        detail: { dropdownName: this.dropdownName, value },
      }) satisfies ToolDropdownSelectEvent,
    );
  }

  private renderLabel() {
    if (this.labelDataAttribute === "data-language-label") {
      return html`<span class="tool-island__label" data-language-label>${this.label}</span>`;
    }

    if (this.labelDataAttribute === "data-theme-label") {
      return html`<span class="tool-island__label" data-theme-label>${this.label}</span>`;
    }

    return html`<span class="tool-island__label">${this.label}</span>`;
  }

  private renderIcon() {
    if (!this.icon) {
      return null;
    }

    return createElement(this.icon, {
      "aria-hidden": "true",
      class: "tool-island__icon",
      focusable: "false",
    });
  }

  private renderOption(option: ToolDropdownOption) {
    const ariaSelected = String(option.selected);

    if (this.optionDataAttribute === "data-language") {
      return html`
        <button
          class="tool-island__option"
          type="button"
          role="option"
          data-language=${option.value}
          aria-selected=${ariaSelected}
          @click=${() => this.emitSelection(option.value)}
        >
          ${option.label}
        </button>
      `;
    }

    if (this.optionDataAttribute === "data-theme") {
      return html`
        <button
          class="tool-island__option"
          type="button"
          role="option"
          data-theme=${option.value}
          aria-selected=${ariaSelected}
          @click=${() => this.emitSelection(option.value)}
        >
          ${option.label}
        </button>
      `;
    }

    return html`
      <button
        class="tool-island__option"
        type="button"
        role="option"
        aria-selected=${ariaSelected}
        @click=${() => this.emitSelection(option.value)}
      >
        ${option.label}
      </button>
    `;
  }

  private renderSearch() {
    return html`
      <div class="tool-island__menu-search">
        ${createElement(Search, {
          "aria-hidden": "true",
          class: "tool-island__search-icon",
          focusable: "false",
        })}
        <input
          class="tool-island__search-input"
          type="text"
          size="1"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="search"
          placeholder=${this.searchPlaceholder}
          aria-label=${this.searchPlaceholder}
          .value=${this.searchQuery}
          @input=${this.handleSearchInput}
          @keydown=${this.handleSearchKeydown}
        />
        ${
          this.searchQuery
            ? html`
                <button
                  class="tool-island__search-clear"
                  type="button"
                  aria-label="Clear search"
                  @click=${this.clearSearch}
                >
                  ${createElement(X, {
                    "aria-hidden": "true",
                    class: "tool-island__search-clear-icon",
                    focusable: "false",
                  })}
                </button>
              `
            : null
        }
      </div>
    `;
  }

  private renderNoMatches() {
    return html`<div class="tool-island__menu-empty">No matches</div>`;
  }

  protected override render() {
    const options = this.filteredOptions;

    return html`
      <div
        class=${`tool-island__dropdown${this.open ? " is-open" : ""}`}
        data-dropdown=${this.dropdownName}
      >
        <button
          class=${`${this.buttonClassName} tool-island__select`}
          type="button"
          aria-expanded=${String(this.open)}
          aria-haspopup="listbox"
          @click=${this.emitToggle}
        >
          <span class="tool-island__select-content"
            >${this.renderIcon()} ${this.renderLabel()}</span
          >
        </button>
        <div class="tool-island__menu">
          ${this.searchable ? this.renderSearch() : null}
          <div class="tool-island__menu-scroll">
            <div class="tool-island__menu-options" role="listbox" aria-label=${this.listboxLabel}>
              ${options.map((option) => this.renderOption(option))}
            </div>
            ${this.searchable && options.length === 0 ? this.renderNoMatches() : null}
          </div>
        </div>
      </div>
    `;
  }
}
