import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app")!;
const { renderSnapshotFromHash, setupCodeContainer } = await import("./code.ts");

if (!(await renderSnapshotFromHash(appElement))) {
  appElement.innerHTML = `
  <section id="center">
    <header class="brand-lockup" aria-label="SourceShot by Alex Spinu">
      <h1 class="brand-title" data-text="SourceShot">SourceShot</h1>
      <p class="brand-byline">
        by <a href="https://github.com/spinualexandru" rel="me noopener" target="_blank">Alex Spinu</a>
      </p>
    </header>
    <div id="code"></div>
  </section>
  
  `;

  const codeElement = document.querySelector<HTMLDivElement>("#code")!;
  setupCodeContainer(codeElement);
}
