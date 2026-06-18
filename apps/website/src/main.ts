import { html, render } from "lit";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app")!;
const { renderSnapshotFromHash } = await import("./code.ts");

if (!(await renderSnapshotFromHash(appElement))) {
  await import("./components/source-shot-app.ts");
  render(html`<source-shot-app></source-shot-app>`, appElement);
}
