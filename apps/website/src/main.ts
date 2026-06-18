import { html, render } from "lit";
import "./components/source-shot-app.ts";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app")!;
const { renderSnapshotFromHash } = await import("./code.ts");

if (!(await renderSnapshotFromHash(appElement))) {
  render(html`<source-shot-app></source-shot-app>`, appElement);
}
