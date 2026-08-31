# create-preffx

Scaffold a new [PreffX](https://github.com/msabitov/preffx) + [Vite](https://vite.dev) project with ease.

> PreffX — signal-based reactive UI framework built on `@preact/signals-core`

## Quick Start

```bash
npx create-preffx
```

Or using your preferred package manager:

```bash
npm create preffx@latest
yarn create preffx
pnpm create preffx
bun create preffx
```

## Usage

### Interactive mode (default)

Run without arguments to launch the interactive prompt:

```bash
create-preffx
```

You'll be guided through:
- Project name
- Language (TypeScript / JavaScript)
- Rendering mode (CSR / SSR)
- CSS solution (None / CSS Modules / Tailwind CSS)
- Package manager (npm / yarn / pnpm / bun)

### Non-interactive mode

Pass a project name and options directly:

```bash
create-preffx my-app --js --css tailwind --pm pnpm
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--js` | Use JavaScript (instead of TypeScript) | TypeScript |
| `--css <type>` | CSS solution: `none`, `modules`, `tailwind` | `none` |
| `--pm <manager>` | Package manager: `npm`, `yarn`, `pnpm`, `bun` | `npm` |
| `--ssr` | Scaffold an SSR project (Vite SSR + Express) | CSR |
| `--no-install` | Skip dependency installation | false |
| `--help` | Show help message | - |
| `--version` | Show version | - |

### Examples

```bash
# TypeScript + plain CSS (default)
create-preffx my-app

# JavaScript + CSS Modules
create-preffx my-app --js --css modules

# TypeScript + Tailwind CSS + pnpm
create-preffx my-app --css tailwind --pm pnpm

# JavaScript + plain CSS, skip install
create-preffx my-app --js --no-install

# TypeScript + SSR
create-preffx my-app --ssr
```

## Generated Project Structure

```
my-preffx-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── preffx-logo.svg
│   │   └── vite-logo.svg
│   ├── components/
│   ├── App.tsx (or App.jsx)
│   ├── App.css (or App.module.css)
│   ├── main.tsx (or main.jsx)
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts (or vite.config.js)
├── tsconfig.json (TS only)
├── tsconfig.app.json (TS only)
└── tsconfig.node.json (TS only)
```

In **SSR mode** (`--ssr`), the entry points change and an Express server is added:

```
my-preffx-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── vite-logo.svg
│   ├── components/
│   ├── entry-client.tsx (or .jsx)
│   ├── entry-server.tsx (or .jsx)
│   ├── App.tsx (or App.jsx)
│   ├── App.css (or App.module.css)
│   └── index.css
├── server.js
├── index.html
├── package.json
├── vite.config.ts (or vite.config.js)
├── tsconfig.json (TS only)
├── tsconfig.app.json (TS only)
└── tsconfig.node.json (TS only)
```

Server-rendering uses PreffX's [`preffx/server`](https://github.com/msabitov/preffx) entry: `createRoot().renderToString(...)`. `await preload()` resolves async resources before the markup is serialized, and the client `entry-client` automatically hydrates the server-emitted markup. Run with `npm run dev` (starts Express + Vite middleware) or `npm run build && npm run preview` for production.

## Features

- **⚡ Vite 8** — Lightning-fast HMR and builds
- **📦 PreffX** — Signal-based reactive UI framework
- **🖥️ SSR** — Server-side rendered templates via `preffx/server` + Express
- **🔧 TypeScript** — First-class TypeScript support
- **🎨 CSS Options** — Plain CSS, CSS Modules, or Tailwind CSS v4
- **📱 Cross-platform** — Works on Windows, macOS, Linux

## Development

```bash
# Install dependencies
cd create-preffx
npm install

# Run locally
node bin/index.js
```

## License

Apache-2.0