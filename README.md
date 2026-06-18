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
