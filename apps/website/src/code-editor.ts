import {
  type AppTheme,
  type LanguageOption,
  getThemeOption,
  languageOptions,
  themeOptions,
} from "./code-options.ts";
import { renderCodeHtml } from "./code-highlight.ts";
import { initialCode } from "./sample-code.ts";
import { downloadPageSnapshot } from "./snapshot-export.ts";
import { applyTheme, getStoredTheme, storeTheme } from "./theme.ts";
import html from "./lib/highlighter.ts";

function renderThemeOptions(selectedTheme: AppTheme) {
  return themeOptions
    .map(
      (theme) => html`
        <button
          class="tool-island__option"
          type="button"
          role="option"
          data-theme="${theme.value}"
          aria-selected="${theme.value === selectedTheme}"
        >
          ${theme.label}
        </button>
      `,
    )
    .join("");
}

function renderLanguageOptions(selectedLanguage: LanguageOption) {
  return languageOptions
    .map(
      (language) => html`
        <button
          class="tool-island__option"
          type="button"
          role="option"
          data-language="${language.value}"
          aria-selected="${language.value === selectedLanguage.value}"
        >
          ${language.label}
        </button>
      `,
    )
    .join("");
}

function renderEditorChrome(selectedLanguage: LanguageOption, selectedTheme: AppTheme) {
  return html`
    <div class="code__container">
      <div class="code__header">
        <div class="code__window-decoration">
          <div class="code-window-decoration" data-color="red"></div>
          <div class="code-window-decoration" data-color="yellow"></div>
          <div class="code-window-decoration" data-color="green"></div>
        </div>
      </div>
      <div class="code__editor">
        <div class="code__output" aria-hidden="true"></div>
      </div>
    </div>
    <div class="theme-switcher" aria-label="Theme selector">
      <div class="tool-island__dropdown" data-dropdown="theme">
        <button
          class="theme-switcher__button tool-island__select"
          type="button"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <span data-theme-label>${getThemeOption(selectedTheme).label}</span>
        </button>
        <div class="tool-island__menu">
          <div class="tool-island__menu-scroll" role="listbox" aria-label="Themes">
            ${renderThemeOptions(selectedTheme)}
          </div>
        </div>
      </div>
    </div>
    <div class="tool-island" aria-label="SourceShot tools">
      <button class="tool-island__button" type="button" data-action="export">Export</button>
      <div class="tool-island__dropdown" data-dropdown="language">
        <button
          class="tool-island__button tool-island__select"
          type="button"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <span data-language-label>${selectedLanguage.label}</span>
        </button>
        <div class="tool-island__menu">
          <div class="tool-island__menu-scroll" role="listbox" aria-label="Programming languages">
            ${renderLanguageOptions(selectedLanguage)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function createCodeTextArea(selectedLanguage: LanguageOption) {
  const codeTextArea = document.createElement("textarea");
  codeTextArea.classList.add("code__textarea");
  codeTextArea.value = initialCode;
  codeTextArea.spellcheck = false;
  codeTextArea.autocapitalize = "off";
  codeTextArea.autocomplete = "off";
  codeTextArea.setAttribute("wrap", "off");
  codeTextArea.setAttribute("aria-label", `${selectedLanguage.label} code editor`);
  return codeTextArea;
}

export function setupCodeContainer(element: HTMLElement) {
  let selectedLanguage: LanguageOption = languageOptions[0];
  let selectedTheme = getStoredTheme();
  applyTheme(selectedTheme);

  const codeContainer = document.createElement("div");
  const codeTextArea = createCodeTextArea(selectedLanguage);
  codeContainer.innerHTML = renderEditorChrome(selectedLanguage, selectedTheme);

  const codeEditorElement = codeContainer.querySelector(".code__editor") as HTMLDivElement;
  const codeOutputElement = codeContainer.querySelector(".code__output") as HTMLDivElement;
  const exportButton = codeContainer.querySelector('[data-action="export"]') as HTMLButtonElement;
  const dropdownElements = Array.from(
    codeContainer.querySelectorAll<HTMLDivElement>(".tool-island__dropdown"),
  );
  const themeDropdownElement = codeContainer.querySelector(
    '[data-dropdown="theme"]',
  ) as HTMLDivElement;
  const languageDropdownElement = codeContainer.querySelector(
    '[data-dropdown="language"]',
  ) as HTMLDivElement;
  const themeButton = themeDropdownElement.querySelector(
    ".theme-switcher__button",
  ) as HTMLButtonElement;
  const languageButton = languageDropdownElement.querySelector(
    ".tool-island__select",
  ) as HTMLButtonElement;
  const themeLabel = codeContainer.querySelector("[data-theme-label]") as HTMLSpanElement;
  const languageLabel = codeContainer.querySelector("[data-language-label]") as HTMLSpanElement;
  const themeOptionButtons = Array.from(
    codeContainer.querySelectorAll<HTMLButtonElement>("[data-theme]"),
  );
  const languageOptionButtons = Array.from(
    codeContainer.querySelectorAll<HTMLButtonElement>("[data-language]"),
  );
  codeEditorElement.appendChild(codeTextArea);

  const syncScroll = () => {
    codeOutputElement.style.transform = `translate(${-codeTextArea.scrollLeft}px, ${-codeTextArea.scrollTop}px)`;
  };

  const getDropdownButton = (dropdownElement: HTMLDivElement) =>
    dropdownElement.querySelector(".tool-island__select") as HTMLButtonElement;

  const setDropdownOpen = (dropdownElement: HTMLDivElement, isOpen: boolean) => {
    for (const currentDropdown of dropdownElements) {
      const nextIsOpen = currentDropdown === dropdownElement && isOpen;
      currentDropdown.classList.toggle("is-open", nextIsOpen);
      getDropdownButton(currentDropdown).setAttribute("aria-expanded", String(nextIsOpen));
    }
  };

  const closeDropdowns = () => {
    for (const dropdownElement of dropdownElements) {
      dropdownElement.classList.remove("is-open");
      getDropdownButton(dropdownElement).setAttribute("aria-expanded", "false");
    }
  };

  let renderId = 0;
  const render = async () => {
    const nextRenderId = ++renderId;
    const html = await renderCodeHtml(codeTextArea.value, selectedLanguage.value, selectedTheme);

    if (nextRenderId !== renderId) {
      return;
    }

    codeOutputElement.innerHTML = html;
    syncScroll();
  };

  exportButton.addEventListener("click", () => {
    if (exportButton.disabled) {
      return;
    }

    exportButton.disabled = true;
    void downloadPageSnapshot(codeTextArea.value, selectedLanguage.value, selectedTheme)
      .catch((error: unknown) => {
        console.error("Failed to export snapshot", error);
      })
      .finally(() => {
        exportButton.disabled = false;
      });
  });

  themeButton.addEventListener("click", () => {
    setDropdownOpen(themeDropdownElement, !themeDropdownElement.classList.contains("is-open"));
  });

  languageButton.addEventListener("click", () => {
    setDropdownOpen(
      languageDropdownElement,
      !languageDropdownElement.classList.contains("is-open"),
    );
  });

  for (const optionButton of themeOptionButtons) {
    optionButton.addEventListener("click", () => {
      const nextTheme = themeOptions.find((theme) => theme.value === optionButton.dataset.theme);

      if (!nextTheme) {
        return;
      }

      selectedTheme = nextTheme.value;
      themeLabel.textContent = nextTheme.label;
      applyTheme(selectedTheme);
      storeTheme(selectedTheme);

      for (const button of themeOptionButtons) {
        button.setAttribute("aria-selected", String(button === optionButton));
      }

      closeDropdowns();
      void render();
    });
  }

  for (const optionButton of languageOptionButtons) {
    optionButton.addEventListener("click", () => {
      const nextLanguage = languageOptions.find(
        (language) => language.value === optionButton.dataset.language,
      );

      if (!nextLanguage) {
        return;
      }

      selectedLanguage = nextLanguage;
      languageLabel.textContent = nextLanguage.label;
      codeTextArea.setAttribute("aria-label", `${selectedLanguage.label} code editor`);

      for (const button of languageOptionButtons) {
        button.setAttribute("aria-selected", String(button === optionButton));
      }

      closeDropdowns();
      void render();
    });
  }

  document.addEventListener("pointerdown", (event) => {
    if (
      !dropdownElements.some((dropdownElement) => dropdownElement.contains(event.target as Node))
    ) {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
    }
  });

  codeTextArea.addEventListener("input", () => {
    void render();
  });

  codeTextArea.addEventListener("scroll", syncScroll);

  codeTextArea.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const selectionStart = codeTextArea.selectionStart;
    const selectionEnd = codeTextArea.selectionEnd;
    codeTextArea.setRangeText("  ", selectionStart, selectionEnd, "end");
    codeTextArea.dispatchEvent(new Event("input", { bubbles: true }));
  });

  element.appendChild(codeContainer);
  void render();
}
