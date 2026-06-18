import { html, render } from "lit";
import { downloadBlob, openBlobImage } from "./blob-actions.ts";
import {
  type AppTheme,
  type CodeLanguage,
  defaultTheme,
  isAppTheme,
  isCodeLanguage,
  languageOptions,
} from "./code-options.ts";
import { createPageSnapshotBlob } from "./snapshot-export.ts";
import { applyTheme } from "./theme.ts";

type SnapshotRequest = {
  code: string;
  language: CodeLanguage;
  theme: AppTheme;
};

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

function getSnapshotRequestFromHash(hash: string): SnapshotRequest | undefined {
  const params = getHashParams(hash);
  const encodedCode = params.get("code");

  if (!encodedCode) {
    return undefined;
  }

  const requestedLanguage = params.get("language") ?? params.get("lang");
  const requestedTheme = params.get("theme");

  return {
    code: decodeBase64Code(encodedCode),
    language: isCodeLanguage(requestedLanguage) ? requestedLanguage : languageOptions[0].value,
    theme: isAppTheme(requestedTheme) ? requestedTheme : defaultTheme,
  };
}

export async function renderSnapshotFromHash(element: HTMLElement) {
  let snapshotRequest: SnapshotRequest | undefined;

  try {
    snapshotRequest = getSnapshotRequestFromHash(window.location.hash);
  } catch (error: unknown) {
    if (!getHashParams(window.location.hash).has("code")) {
      return false;
    }

    console.error("Failed to decode snapshot hash", error);
    document.body.classList.add("is-snapshot-route");
    render(
      html`<div class="snapshot-route-status" role="alert">Could not decode snapshot code.</div>`,
      element,
    );
    return true;
  }

  if (!snapshotRequest) {
    return false;
  }

  document.body.classList.add("is-snapshot-route");
  applyTheme(snapshotRequest.theme);
  render(html`<div class="snapshot-route-status">Rendering snapshot...</div>`, element);

  try {
    const { blob } = await createPageSnapshotBlob(
      snapshotRequest.code,
      snapshotRequest.language,
      snapshotRequest.theme,
    );
    downloadBlob(blob, "snapshot-page.png");
    openBlobImage(blob);
  } catch (error: unknown) {
    console.error("Failed to render snapshot from hash", error);
    render(
      html`<div class="snapshot-route-status" role="alert">Could not render snapshot.</div>`,
      element,
    );
  }

  return true;
}
