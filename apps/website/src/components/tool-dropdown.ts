import html from "../lib/highlighter.ts";

type ToolDropdownOptions = {
  buttonClassName: string;
  dropdownName: string;
  label: string;
  labelDataAttribute: string;
  listboxLabel: string;
  optionsHtml: string;
};

type ToolOptionOptions = {
  dataAttribute: string;
  label: string;
  selected: boolean;
  value: string;
};

export function renderToolDropdown({
  buttonClassName,
  dropdownName,
  label,
  labelDataAttribute,
  listboxLabel,
  optionsHtml,
}: ToolDropdownOptions) {
  return html`
    <div class="tool-island__dropdown" data-dropdown="${dropdownName}">
      <button
        class="${buttonClassName} tool-island__select"
        type="button"
        aria-expanded="false"
        aria-haspopup="listbox"
      >
        <span ${labelDataAttribute}>${label}</span>
      </button>
      <div class="tool-island__menu">
        <div class="tool-island__menu-scroll" role="listbox" aria-label="${listboxLabel}">
          ${optionsHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderToolOption({ dataAttribute, label, selected, value }: ToolOptionOptions) {
  return html`
    <button
      class="tool-island__option"
      type="button"
      role="option"
      ${dataAttribute}="${value}"
      aria-selected="${selected}"
    >
      ${label}
    </button>
  `;
}
