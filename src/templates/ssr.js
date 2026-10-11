/**
 * SSR-specific templates for create-preffx.
 * Implements a Vite SSR setup (entry-client / entry-server / server.js)
 * using PreffX 0.8.1 `preffx/server`.
 */

const JSX_OXC = `  oxc: {
    jsx: {
      importSource: 'preffx',
      pragmaFrag: 'Fragment',
      pragma: 'h',
    },
    jsxInject: \`import {h, Fragment} from 'preffx'\`,
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        jsx: {
          pragma: 'h',
          pragmaFrag: 'Fragment',
          importSource: 'preffx',
        },
      },
    },
  },
`;

/**
 * Template for index.html (SSR mode, shared between JS and TS).
 */
export function htmlTemplateSsr(projectName, isTs) {
  const entry = isTs ? 'entry-client.tsx' : 'entry-client.jsx';
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${projectName}</title>
    <style>
      /* Critical styles prevent logo flash before index.css loads */
      html, body {
        margin: 0;
        min-height: 100vh;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #app {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .logos {
        display: flex;
        gap: 2rem;
        align-items: center;
        justify-content: center;
      }
      .logo {
        height: 160px;
        padding: 24px;
      }
    </style>
  </head>
  <body>
    <div id="app"><!--app-html--></div>
    <script type="module" src="/src/${entry}"></script>
  </body>
</html>
`;
}

/**
 * Template for src/entry-client.jsx.
 * Imports the app CSS on the client and mounts with automatic hydration
 * (the server-emitted `data-preffx-preload` script is consumed by mount).
 */
export function entryClientJsxTemplate() {
  return `import { createRoot } from 'preffx'
import './index.css'
import { App } from './App'

// Mount into #app; PreffX hydrates the server-emitted markup automatically
createRoot().mount(App, { node: document.getElementById('app') });
`;
}

/**
 * Template for src/entry-client.tsx.
 */
export function entryClientTsxTemplate() {
  return `import { createRoot } from 'preffx'
import './index.css'
import { App } from './App'

// Mount into #app; PreffX hydrates the server-emitted markup automatically
createRoot().mount(App, { node: document.getElementById('app') as HTMLElement });
`;
}

/**
 * Template for src/entry-server.jsx.
 * Uses PreffX 0.8.1 `preffx/server` createRoot + renderToString.
 */
export function entryServerJsxTemplate() {
  return `import { createRoot } from 'preffx/server'
import { App } from './App'

const server = createRoot();

export async function render() {
  const { preload, serialize } = server.renderToString(App, {});
  // Await resources (async data) before serializing the markup
  await preload();
  const html = serialize();
  return { html };
}
`;
}

/**
 * Template for src/entry-server.tsx.
 */
export function entryServerTsxTemplate() {
  return `import { createRoot } from 'preffx/server'
import { App } from './App'

const server = createRoot();

export async function render(): Promise<{ html: string }> {
  const { preload, serialize } = server.renderToString(App, {});
  // Await resources (async data) before serializing the markup
  await preload();
  const html = serialize();
  return { html };
}
`;
}

/**
 * Template for server.js (shared between JS and TS).
 * Uses Vite middleware in dev and static file serving in production.
 *
 * @param {boolean} isTs - whether the project uses TypeScript
 */
export function serverJsTemplate(isTs) {
  const entryServerExt = isTs ? 'tsx' : 'jsx';

  return `import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const root = process.cwd();
const port = process.env.PORT || 5173;

async function startServer() {
  const app = express();

  let vite;
  if (!isProd) {
    // Dev: use Vite's dev server with custom middleware mode
    vite = await createViteServer({
      root,
      appType: 'custom',
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
  } else {
    // Prod: serve built client assets
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template;
      let render;
      if (!isProd) {
        template = fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8');
        // transformIndexHtml injects the HMR client during dev
        template = await vite.transformIndexHtml(url, template);
        const mod = await vite.ssrLoadModule('/src/entry-server.${entryServerExt}');
        render = mod.render;
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
        const mod = await import(path.resolve(__dirname, 'dist-server/entry-server.js'));
        render = mod.render;
      }

      const { html } = await render(url);
      const page = template.replace('<!--app-html-->', html);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
    } catch (err) {
      if (!isProd) vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).end(err.stack || err.message);
    }
  });

  app.listen(port, () => {
    console.log(\`Server running at http://localhost:\${port}\`);
  });
}

startServer();
`;
}

/**
 * Template for vite.config with SSR (no index.html plugin; server handles HTML).
 * Shared between JS and TS, with optional Tailwind plugin.
 */
export function viteConfigSsrTemplate(css) {
  const tailwindImport = css === 'tailwind'
    ? `import tailwindcss from '@tailwindcss/vite'`
    : '';
  const tailwindPlugins = css === 'tailwind'
    ? `
  plugins: [
    tailwindcss(),
  ],`
    : '';

  return `import { defineConfig } from 'vite'
${tailwindImport}

export default defineConfig({${tailwindPlugins}
${JSX_OXC}})
`;
}

/**
 * Template for src/App.jsx in SSR mode (plain CSS).
 * Demonstrates a `resource` (async data) that is awaited via prefetch
 * on the server within preload().
 */
export function appJsxSsrTemplate() {
  return `import './App.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { resource, computed }) {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class="card">
      <div class="logos">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class="logo preffx" alt="PreffX logo" />
        </a>
      </div>
      <h1>Vite + PreffX (SSR)</h1>
      <p class="greeting">{text}</p>
      <button onClick={() => refetch()}>reload greeting</button>
      <p>
        Edit <code>src/App.jsx</code> to test server-rendered content
      </p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.jsx in SSR mode (CSS Modules).
 */
export function appJsxSsrModuleCssTemplate() {
  return `import styles from './App.module.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { resource, computed }) {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class={styles.card}>
      <div class={styles.logos}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class={styles.logo + ' ' + styles.logoPreffx} alt="PreffX logo" />
        </a>
      </div>
      <h1>Vite + PreffX (SSR)</h1>
      <p class={styles.greeting}>{text}</p>
      <button onClick={() => refetch()}>reload greeting</button>
      <p>Edit <code>src/App.jsx</code> to test server-rendered content</p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.jsx in SSR mode (Tailwind CSS).
 */
export function appJsxSsrTailwindTemplate() {
  return `import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { resource, computed }) {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class="flex flex-col items-center gap-4 p-8">
      <div class="flex gap-8 items-center justify-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class="h-40 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class="h-40 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#0099e5aa]" alt="PreffX logo" />
        </a>
      </div>
      <h1 class="text-4xl font-bold">Vite + PreffX (SSR)</h1>
      <p>{text}</p>
      <button
        class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-100 dark:bg-gray-800 cursor-pointer transition-[border-color] duration-250 hover:border-[#646cff] active:outline-4 active:outline-[#646cff]"
        onClick={() => refetch()}
      >
        reload greeting
      </button>
      <p>Edit <code>src/App.jsx</code> to test server-rendered content</p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.tsx in SSR mode (plain CSS).
 */
export function appTsxSsrTemplate() {
  return `import type { PC } from 'preffx'
import './App.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { resource, computed }) => {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class="card">
      <div class="logos">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class="logo preffx" alt="PreffX logo" />
        </a>
      </div>
      <h1>Vite + PreffX (SSR)</h1>
      <p class="greeting">{text}</p>
      <button onClick={() => refetch()}>reload greeting</button>
      <p>Edit <code>src/App.tsx</code> to test server-rendered content</p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.tsx in SSR mode (CSS Modules).
 */
export function appTsxSsrModuleCssTemplate() {
  return `import type { PC } from 'preffx'
import styles from './App.module.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { resource, computed }) => {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class={styles.card}>
      <div class={styles.logos}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class={styles.logo + ' ' + styles.logoPreffx} alt="PreffX logo" />
        </a>
      </div>
      <h1>Vite + PreffX (SSR)</h1>
      <p class={styles.greeting}>{text}</p>
      <button onClick={() => refetch()}>reload greeting</button>
      <p>Edit <code>src/App.tsx</code> to test server-rendered content</p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.tsx in SSR mode (Tailwind CSS).
 */
export function appTsxSsrTailwindTemplate() {
  return `import type { PC } from 'preffx'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { resource, computed }) => {
  const [greeting, refetch] = resource(async () => {
    return { text: 'Hello from server-rendered PreffX!' };
  });
  const text = computed(() => greeting.state.value?.text ?? 'loading...');

  return (
    <div class="flex flex-col items-center gap-4 p-8">
      <div class="flex gap-8 items-center justify-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class="h-40 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://github.com/msabitov/preffx" target="_blank" rel="noreferrer">
          <img src={preffxLogo} class="h-40 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#0099e5aa]" alt="PreffX logo" />
        </a>
      </div>
      <h1 class="text-4xl font-bold">Vite + PreffX (SSR)</h1>
      <p>{text}</p>
      <button
        class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-100 dark:bg-gray-800 cursor-pointer transition-[border-color] duration-250 hover:border-[#646cff] active:outline-4 active:outline-[#646cff]"
        onClick={() => refetch()}
      >
        reload greeting
      </button>
      <p>Edit <code>src/App.tsx</code> to test server-rendered content</p>
    </div>
  );
};
`;
}
