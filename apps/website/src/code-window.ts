export function createCodeWindowMarkup(codeHtml: string) {
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
