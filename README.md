# SourceShot

Tiny web app for turning source code into clean, shareable image snapshots.

Live site: https://spinualexandru.github.io/sourceshot

<img width="1169" height="998" alt="aaaa" src="https://github.com/user-attachments/assets/676b9351-46d6-4851-af2f-bf257bf05027" />

<img width="2190" height="2080" alt="snapshot-page(12)" src="https://github.com/user-attachments/assets/4e1492fd-9f68-4811-864c-75e07aa3d9d1" />

## Features

- Syntax highlighting with automatic language detection
- Manual language selection for common code formats
- One-click PNG export
- Hash-based snapshot rendering for generated links
- A CLI that renders the same snapshots without a browser

## Hash-based snapshot rendering

You can generate a png snapshot directly by appending a hash to the URL

Example generating a `console.log`:

```bash
https://spinualexandru.github.io/sourceshot/#code=Y29uc29sZS5sb2coJ2hpJyk=&lang=javascript
```

## CLI

`sourceshot` renders a snapshot straight to a PNG, with no browser involved.

```bash
pnpm build:cli

# from a file, next to the source as sample.png
node apps/sourceshot-cli/dist/index.js sample.ts

# from stdin, into a chosen path, in the dark theme
cat sample.ts | node apps/sourceshot-cli/dist/index.js -t mono-dark -o shot.png

# straight into another tool
node apps/sourceshot-cli/dist/index.js sample.ts --stdout | wl-copy
```

| Option                   | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `-o, --output <path>`    | Output path. Defaults to `<file>.png`, or `snapshot.png` for stdin.              |
| `--stdout`               | Write PNG bytes to stdout; all messages go to stderr.                            |
| `--copy`                 | Also copy the image to the system clipboard.                                     |
| `-t, --theme <theme>`    | `mono`, `mono-dark`, `peach`, `ocean`. Defaults to `mono`.                       |
| `-l, --lang <language>`  | Overrides detection. Defaults to `auto`.                                         |
| `-s, --scale <number>`   | Pixel ratio. Defaults to the same automatic 1–2 ramp the web app uses.           |
| `--viewport <px>`        | Simulated viewport width, which drives padding and clamping. Defaults to `1280`. |
| `--max-width <px\|none>` | Card width ceiling. Defaults to `none`; pass `1126` to match the website.        |
| `--grain <0..1>`         | Film grain strength.                                                             |
| `--debug-svg <path>`     | Also write the intermediate SVG.                                                 |

Language is inferred from the file extension first, then from the content.
Exit codes: `0` success, `1` render failure, `2` usage or invalid input, `3` environment
problem such as a missing clipboard helper.

`--copy` needs `wl-copy` (Wayland) or `xclip` (X11) on Linux; `pbcopy` and `clip.exe` cannot
carry image data and are deliberately not used.

### How the CLI output differs from the web app

The CLI renders through satori and resvg rather than a browser, so a few effects the web
export relies on have no equivalent:

| Difference                   | Effect                                                                   |
| ---------------------------- | ------------------------------------------------------------------------ |
| No `backdrop-filter`         | The card glass is a precomputed tint rather than a live blur.            |
| Trimmed `box-shadow` stack   | Four of the ten layers survive; slightly less edge depth.                |
| No `mix-blend-mode` in resvg | Film grain is composited with straight alpha instead of `overlay`.       |
| SVG radial gradients         | Background glows are slightly elliptical in a non-square frame.          |
| Bundled JetBrains Mono       | The web app uses whatever `ui-monospace` resolves to on the viewer's OS. |

The images are visibly the same design, but they are not pixel-identical.

## Development

SourceShot is a pnpm monorepo:

- `apps/website` contains the Vite frontend.
- `apps/sourceshot-cli` contains the Commander-based CLI.
- `packages/sourceshot-core` holds the themes, language detection, syntax highlighting and
  snapshot geometry shared by both.

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm ready
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The CLI bundles [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) under the SIL Open
Font License (see `apps/sourceshot-cli/assets/fonts/OFL.txt`), and depends on
[`@resvg/resvg-js`](https://github.com/thx/resvg-js), which is MPL-2.0.
