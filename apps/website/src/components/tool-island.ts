import { type LanguageOption, languageOptions } from "../code-options.ts";
import html from "../lib/highlighter.ts";
import { renderToolDropdown, renderToolOption } from "./tool-dropdown.ts";

function renderLanguageOptions(selectedLanguage: LanguageOption) {
  return languageOptions
    .map((language) =>
      renderToolOption({
        dataAttribute: "data-language",
        label: language.label,
        selected: language.value === selectedLanguage.value,
        value: language.value,
      }),
    )
    .join("");
}

export function renderToolIsland(selectedLanguage: LanguageOption) {
  return html`
    <div class="tool-island" aria-label="SourceShot tools">
      <button class="tool-island__button" type="button" data-action="export">Export</button>
      ${renderToolDropdown({
        buttonClassName: "tool-island__button",
        dropdownName: "language",
        label: selectedLanguage.label,
        labelDataAttribute: "data-language-label",
        listboxLabel: "Programming languages",
        optionsHtml: renderLanguageOptions(selectedLanguage),
      })}
    </div>
  `;
}
