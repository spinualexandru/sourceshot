import { render } from "lit";
import { type AppTheme, type CodeLanguage } from "./code-options.ts";
import { renderCodeHtml } from "./code-highlight.ts";
import { renderCodeWindow } from "./components/code-window.ts";
import { downloadBlob } from "./blob-actions.ts";
import { applyThemeProperties } from "./theme.ts";

const maxSnapshotWidth = 1280;
const minSnapshotWidth = 320;
const minSnapshotHeight = 220;

let htmlToImagePromise: Promise<typeof import("html-to-image")> | undefined;

async function getHtmlToImage() {
  htmlToImagePromise ??= import("html-to-image");
  return htmlToImagePromise;
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

function waitForLayout() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function renderSnapshotCodeWindow(frame: HTMLElement, codeHtml: string) {
  render(renderCodeWindow({ codeHtml, snapshot: true }), frame);
  await Promise.resolve();
}

async function createSnapshotFrame(codeHtml: string, theme: AppTheme) {
  const initialWidth = Math.max(minSnapshotWidth, Math.min(window.innerWidth, maxSnapshotWidth));
  let snapshotPadding = getSnapshotPadding(initialWidth);
  const host = document.createElement("div");
  const frame = document.createElement("div");
  host.className = "snapshot-host";
  frame.className = "snapshot-frame";
  applyThemeProperties(frame, theme);
  frame.style.setProperty("--snapshot-width", `${initialWidth}px`);
  frame.style.setProperty("--snapshot-height", `${initialWidth}px`);
  frame.style.setProperty("--snapshot-padding", `${snapshotPadding}px`);
  await renderSnapshotCodeWindow(frame, codeHtml);
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

export async function createPageSnapshotBlob(
  code: string,
  language: CodeLanguage,
  theme: AppTheme,
) {
  const codeHtml = await renderCodeHtml(code, language, theme);
  const { frame, host, width, height } = await createSnapshotFrame(codeHtml, theme);

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

export async function downloadPageSnapshot(code: string, language: CodeLanguage, theme: AppTheme) {
  const { blob } = await createPageSnapshotBlob(code, language, theme);
  downloadBlob(blob, "snapshot-page.png");
}

export async function copyPageSnapshotToClipboard(
  code: string,
  language: CodeLanguage,
  theme: AppTheme,
) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("Image clipboard writes are not supported in this browser.");
  }

  const { blob } = await createPageSnapshotBlob(code, language, theme);
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}
