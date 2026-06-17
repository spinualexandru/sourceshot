# SourceShot

Tiny web app for turning source code into clean, shareable image snapshots.

Live site: https://spinualexandru.github.io/sourceshot

<img width="745" height="659" alt="screenshot-min" src="https://github.com/user-attachments/assets/bad934c3-b57d-4ca8-844d-d6bd35f00d3b" />

## Features

- Syntax highlighting with automatic language detection
- Manual language selection for common code formats
- One-click PNG export
- Hash-based snapshot rendering for generated links

## Hash-based snapshot rendering

You can generate a png snapshot directly by appending a hash to the URL

Example generating a `console.log`:

```bash
https://spinualexandru.github.io/sourceshot/#code=Y29uc29sZS5sb2coJ2hpJyk=&lang=javascript
```

## Development

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
