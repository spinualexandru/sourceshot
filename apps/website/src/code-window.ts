import { renderCodeWindow } from "./components/code-window.ts";

export function createCodeWindowMarkup(codeHtml: string) {
  return renderCodeWindow({ codeHtml, snapshot: true });
}
