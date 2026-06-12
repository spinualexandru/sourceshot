const syntaxLanguageOptions = [
  { label: "TypeScript", value: "typescript", extension: "ts" },
  { label: "JavaScript", value: "javascript", extension: "js" },
  { label: "TSX", value: "tsx", extension: "tsx" },
  { label: "JSX", value: "jsx", extension: "jsx" },
  { label: "Python", value: "python", extension: "py" },
  { label: "Go", value: "go", extension: "go" },
  { label: "Rust", value: "rust", extension: "rs" },
  { label: "HTML", value: "html", extension: "html" },
  { label: "CSS", value: "css", extension: "css" },
  { label: "JSON", value: "json", extension: "json" },
  { label: "Markdown", value: "markdown", extension: "md" },
] as const;

const languageOptions = [
  { label: "Auto", value: "auto", extension: "txt" },
  ...syntaxLanguageOptions,
] as const;

type LanguageOption = (typeof languageOptions)[number];
type CodeLanguage = LanguageOption["value"];
type SyntaxLanguage = (typeof syntaxLanguageOptions)[number]["value"];
type CodeTheme = "vitesse-light";

const maxSnapshotWidth = 1280;
const minSnapshotWidth = 320;
const minSnapshotHeight = 220;

const initialCode = `type Brick = {
  color: "red" | "yellow" | "green";
  studs: number;
};

const build = (bricks: Brick[]) =>
  bricks.map((brick) => brick.color).join(" + ");
`;

let htmlToImagePromise: Promise<typeof import("html-to-image")> | undefined;
let shikiPromise:
  | Promise<{
      codeToHtml: (
        code: string,
        options: { lang: SyntaxLanguage; theme: CodeTheme },
      ) => Promise<string>;
    }>
  | undefined;

async function getHtmlToImage() {
  htmlToImagePromise ??= import("html-to-image");
  return htmlToImagePromise;
}

async function getShiki() {
  shikiPromise ??= Promise.all([import("shiki/core"), import("shiki/engine/javascript")]).then(
    ([
      { createBundledHighlighter, createSingletonShorthands },
      { createJavaScriptRegexEngine },
    ]) => {
      const createHighlighter = createBundledHighlighter<SyntaxLanguage, CodeTheme>({
        engine: createJavaScriptRegexEngine,
        langs: {
          css: () => import("shiki/dist/langs/css.mjs"),
          go: () => import("shiki/dist/langs/go.mjs"),
          html: () => import("shiki/dist/langs/html.mjs"),
          javascript: () => import("shiki/dist/langs/javascript.mjs"),
          json: () => import("shiki/dist/langs/json.mjs"),
          jsx: () => import("shiki/dist/langs/jsx.mjs"),
          markdown: () => import("shiki/dist/langs/markdown.mjs"),
          python: () => import("shiki/dist/langs/python.mjs"),
          rust: () => import("shiki/dist/langs/rust.mjs"),
          tsx: () => import("shiki/dist/langs/tsx.mjs"),
          typescript: () => import("shiki/dist/langs/typescript.mjs"),
        },
        themes: {
          "vitesse-light": () => import("shiki/dist/themes/vitesse-light.mjs"),
        },
      });

      return createSingletonShorthands(createHighlighter);
    },
  );
  return shikiPromise;
}

function getSnapshotPixelRatio(width: number, height: number) {
  const highQualityRatio = 2;
  const maxCanvasDimension = 8192;
  const maxCanvasArea = 24_000_000;
  const dimensionRatio = Math.min(maxCanvasDimension / width, maxCanvasDimension / height);
  const areaRatio = Math.sqrt(maxCanvasArea / (width * height));

  return Math.max(1, Math.min(highQualityRatio, dimensionRatio, areaRatio));
}

function getSnapshotPadding(width: number) {
  return width <= 560 ? 28 : 64;
}

function isCodeLanguage(value: string | null): value is CodeLanguage {
  return languageOptions.some((language) => language.value === value);
}

function detectCodeLanguage(code: string): SyntaxLanguage {
  const trimmedCode = code.trim();
  const hasTypeScriptSignals =
    /\b(?:interface|type|enum)\s+\w+/.test(trimmedCode) ||
    /\bimport\s+type\b/.test(trimmedCode) ||
    /:\s*[A-Z_a-z][\w<>{}[\], |]*(?:[,)=;]|=>)/.test(trimmedCode) ||
    /\b(?:as\s+const|satisfies\s+\w)/.test(trimmedCode);

  if (!trimmedCode) {
    return "typescript";
  }

  if (/^[{[]/.test(trimmedCode)) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch {
      // Continue with syntax heuristics.
    }
  }

  if (
    /^<!doctype\s+html\b/i.test(trimmedCode) ||
    /(?:^|[\s>])<\/?[a-z][\w:-]*(?:\s[^<>]*|\/?)>/i.test(trimmedCode)
  ) {
    const hasJsxSignals =
      /\b(?:className|on[A-Z]\w*|use[A-Z]\w*)=/.test(trimmedCode) ||
      /<[A-Z][\w.]*[\s>/]/.test(trimmedCode) ||
      /<[^>]+>[\s\S]*\{[\s\S]*\}[\s\S]*<\/[^>]+>/.test(trimmedCode);
    if (hasJsxSignals) {
      return hasTypeScriptSignals ? "tsx" : "jsx";
    }

    return "html";
  }

  if (/^(?:#|\s*[-*]\s|\s*\d+\.\s|>|\|)/m.test(trimmedCode) || /```[\s\S]*```/.test(trimmedCode)) {
    return "markdown";
  }

  if (/\bpackage\s+main\b/.test(trimmedCode) || /\bfunc\s+\w+\s*\(/.test(trimmedCode)) {
    return "go";
  }

  if (/\bfn\s+\w+\s*\(|\blet\s+mut\b|\bimpl\s+\w+|\btrait\s+\w+|println!\s*\(/.test(trimmedCode)) {
    return "rust";
  }

  if (
    /^\s*(?:from\s+\w[\w.]*\s+import\s+|import\s+\w|def\s+\w+\s*\(|class\s+\w+\s*[:(])/m.test(
      trimmedCode,
    ) ||
    /\bprint\s*\(|^\s*(?:if|for|while|with|try|except|elif)\b.*:\s*$/m.test(trimmedCode)
  ) {
    return "python";
  }

  if (
    /(?:^|[{};])\s*(?:[.#][\w-]+|\w[\w-]*|\*)[\w\s.#:[\],>+~-]*\{\s*[\w-]+\s*:/.test(trimmedCode) ||
    /@(media|supports|container|keyframes)\b/.test(trimmedCode)
  ) {
    return "css";
  }

  if (/<[A-Z_a-z][\w.:-]*(?:\s[^>]*)?>[\s\S]*<\/[A-Z_a-z][\w.:-]*>/.test(trimmedCode)) {
    return hasTypeScriptSignals ? "tsx" : "jsx";
  }

  if (hasTypeScriptSignals) {
    return "typescript";
  }

  if (/\b(?:const|let|var|function|import|export|class)\b/.test(trimmedCode)) {
    return "javascript";
  }

  return "typescript";
}

function resolveCodeLanguage(code: string, language: CodeLanguage): SyntaxLanguage {
  return language === "auto" ? detectCodeLanguage(code) : language;
}

function createCodeWindowMarkup(codeHtml: string) {
  return `
    <div class="code__container code__container--snapshot">
      <div class="code__header">
        <div class="code__window-decoration">
          <div class="code-window-decoration" data-color="red"></div>
          <div class="code-window-decoration" data-color="yellow"></div>
          <div class="code-window-decoration" data-color="green"></div>
        </div>
      </div>
      <div class="code__editor code__editor--snapshot">
        <div class="code__output code__output--snapshot" aria-hidden="true">${codeHtml}</div>
      </div>
    </div>
  `;
}

function waitForLayout() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function renderCodeHtml(code: string, language: CodeLanguage) {
  const { codeToHtml } = await getShiki();
  return codeToHtml(code || " ", {
    lang: resolveCodeLanguage(code, language),
    theme: "vitesse-light",
  });
}

async function createSnapshotFrame(codeHtml: string) {
  const initialWidth = Math.max(minSnapshotWidth, Math.min(window.innerWidth, maxSnapshotWidth));
  let snapshotPadding = getSnapshotPadding(initialWidth);
  const host = document.createElement("div");
  const frame = document.createElement("div");
  host.className = "snapshot-host";
  frame.className = "snapshot-frame";
  frame.style.setProperty("--snapshot-width", `${initialWidth}px`);
  frame.style.setProperty("--snapshot-height", `${initialWidth}px`);
  frame.style.setProperty("--snapshot-padding", `${snapshotPadding}px`);
  frame.innerHTML = createCodeWindowMarkup(codeHtml);
  host.appendChild(frame);

  document.body.appendChild(host);
  await waitForLayout();

  const codeContainer = frame.querySelector<HTMLElement>(".code__container--snapshot");
  const measure = () => {
    if (!codeContainer) {
      return { width: initialWidth, height: initialWidth };
    }

    return {
      width: codeContainer.scrollWidth + snapshotPadding * 2,
      height: codeContainer.scrollHeight + snapshotPadding * 2,
    };
  };

  let measuredSize = measure();
  let width = Math.ceil(Math.max(minSnapshotWidth, measuredSize.width));
  let height = Math.ceil(Math.max(minSnapshotHeight, measuredSize.height));
  const fittedPadding = getSnapshotPadding(width);

  if (fittedPadding !== snapshotPadding) {
    snapshotPadding = fittedPadding;
    frame.style.setProperty("--snapshot-padding", `${snapshotPadding}px`);
    await waitForLayout();

    measuredSize = measure();
    width = Math.ceil(Math.max(minSnapshotWidth, measuredSize.width));
    height = Math.ceil(Math.max(minSnapshotHeight, measuredSize.height));
  }

  frame.style.setProperty("--snapshot-width", `${width}px`);
  frame.style.setProperty("--snapshot-height", `${height}px`);
  await waitForLayout();

  return { frame, host, width, height };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function openBlobImage(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.location.replace(url);
}

async function createPageSnapshotBlob(code: string, language: CodeLanguage) {
  const codeHtml = await renderCodeHtml(code, language);
  const { frame, host, width, height } = await createSnapshotFrame(codeHtml);

  try {
    const { toBlob } = await getHtmlToImage();
    const blob = await toBlob(frame, {
      cacheBust: true,
      height,
      pixelRatio: getSnapshotPixelRatio(width, height),
      skipAutoScale: true,
      width,
    });

    if (!blob) {
      throw new Error("Snapshot export did not produce an image.");
    }

    return { blob, height, width };
  } finally {
    host.remove();
  }
}

async function downloadPageSnapshot(code: string, language: CodeLanguage) {
  const { blob } = await createPageSnapshotBlob(code, language);
  downloadBlob(blob, "snapshot-page.png");
}

function decodeBase64Code(encodedCode: string) {
  const normalizedCode = encodedCode
    .trim()
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s/g, "+");
  const paddingLength = (4 - (normalizedCode.length % 4)) % 4;
  const base64Code = normalizedCode + "=".repeat(paddingLength);
  const binaryCode = atob(base64Code);
  const bytes = Uint8Array.from(binaryCode, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function getHashParams(hash: string) {
  const hashValue = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(hashValue.startsWith("?") ? hashValue.slice(1) : hashValue);
}

function getSnapshotRequestFromHash(hash: string) {
  const params = getHashParams(hash);
  const encodedCode = params.get("code");

  if (!encodedCode) {
    return undefined;
  }

  const requestedLanguage = params.get("language") ?? params.get("lang");

  return {
    code: decodeBase64Code(encodedCode),
    language: isCodeLanguage(requestedLanguage) ? requestedLanguage : languageOptions[0].value,
  };
}

export async function renderSnapshotFromHash(element: HTMLElement) {
  let snapshotRequest: ReturnType<typeof getSnapshotRequestFromHash>;

  try {
    snapshotRequest = getSnapshotRequestFromHash(window.location.hash);
  } catch (error: unknown) {
    if (!getHashParams(window.location.hash).has("code")) {
      return false;
    }

    console.error("Failed to decode snapshot hash", error);
    document.body.classList.add("is-snapshot-route");
    element.innerHTML =
      '<div class="snapshot-route-status" role="alert">Could not decode snapshot code.</div>';
    return true;
  }

  if (!snapshotRequest) {
    return false;
  }

  document.body.classList.add("is-snapshot-route");
  element.innerHTML = '<div class="snapshot-route-status">Rendering snapshot...</div>';

  try {
    const { blob } = await createPageSnapshotBlob(snapshotRequest.code, snapshotRequest.language);
    downloadBlob(blob, "snapshot-page.png");
    openBlobImage(blob);
  } catch (error: unknown) {
    console.error("Failed to render snapshot from hash", error);
    element.innerHTML =
      '<div class="snapshot-route-status" role="alert">Could not render snapshot.</div>';
  }

  return true;
}

export function setupCodeContainer(element: HTMLElement) {
  let selectedLanguage: LanguageOption = languageOptions[0];

  const codeContainer = document.createElement("div");
  const codeTextArea = document.createElement("textarea");
  codeTextArea.classList.add("code__textarea");
  codeTextArea.value = initialCode;
  codeTextArea.spellcheck = false;
  codeTextArea.autocapitalize = "off";
  codeTextArea.autocomplete = "off";
  codeTextArea.setAttribute("wrap", "off");
  codeTextArea.setAttribute("aria-label", `${selectedLanguage.label} code editor`);

  codeContainer.innerHTML = `
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
    <div class="tool-island" aria-label="SourceShot tools">
      <button class="tool-island__button" type="button" data-action="export">Export</button>
      <div class="tool-island__dropdown">
        <button class="tool-island__button tool-island__select" type="button" aria-expanded="false" aria-haspopup="listbox">
          <span data-language-label>${selectedLanguage.label}</span>
        </button>
        <div class="tool-island__menu">
          <div class="tool-island__menu-scroll" role="listbox" aria-label="Programming languages">
            ${languageOptions
              .map(
                (language) => `
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
              .join("")}
          </div>
        </div>
      </div>
    </div>
`;

  const codeEditorElement = codeContainer.querySelector(".code__editor") as HTMLDivElement;
  const codeOutputElement = codeContainer.querySelector(".code__output") as HTMLDivElement;
  const exportButton = codeContainer.querySelector('[data-action="export"]') as HTMLButtonElement;
  const dropdownElement = codeContainer.querySelector(".tool-island__dropdown") as HTMLDivElement;
  const languageButton = codeContainer.querySelector(".tool-island__select") as HTMLButtonElement;
  const languageLabel = codeContainer.querySelector("[data-language-label]") as HTMLSpanElement;
  const languageOptionButtons = Array.from(
    codeContainer.querySelectorAll<HTMLButtonElement>("[data-language]"),
  );
  codeEditorElement.appendChild(codeTextArea);

  const syncScroll = () => {
    codeOutputElement.style.transform = `translate(${-codeTextArea.scrollLeft}px, ${-codeTextArea.scrollTop}px)`;
  };

  const setDropdownOpen = (isOpen: boolean) => {
    dropdownElement.classList.toggle("is-open", isOpen);
    languageButton.setAttribute("aria-expanded", String(isOpen));
  };

  let renderId = 0;
  const render = async () => {
    const nextRenderId = ++renderId;
    const html = await renderCodeHtml(codeTextArea.value, selectedLanguage.value);

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
    void downloadPageSnapshot(codeTextArea.value, selectedLanguage.value)
      .catch((error: unknown) => {
        console.error("Failed to export snapshot", error);
      })
      .finally(() => {
        exportButton.disabled = false;
      });
  });

  languageButton.addEventListener("click", () => {
    setDropdownOpen(!dropdownElement.classList.contains("is-open"));
  });

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

      setDropdownOpen(false);
      void render();
    });
  }

  document.addEventListener("pointerdown", (event) => {
    if (!dropdownElement.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setDropdownOpen(false);
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
