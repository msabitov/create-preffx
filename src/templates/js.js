/**
 * JavaScript-specific templates for create-preffx.
 */

/**
 * Template for src/main.jsx.
 */
export function mainJsxTemplate() {
  return `import { createRoot } from 'preffx'
import './index.css'
import { App } from './App'

createRoot().mount(App, { node: document.getElementById('app') });
`;
}

/**
 * Template for src/App.jsx (plain CSS).
 */
export function appJsxTemplate() {
  return `import './App.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { signal }) {
  const count = signal(0);

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
      <h1>Vite + PreffX</h1>
      <button onClick={() => { count.value += 1 }}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.jsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.jsx (CSS Modules).
 */
export function appJsxModuleCssTemplate() {
  return `import styles from './App.module.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { signal }) {
  const count = signal(0);

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
      <h1>Vite + PreffX</h1>
      <button onClick={() => { count.value += 1 }}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.jsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.jsx (Tailwind CSS).
 */
export function appJsxTailwindTemplate() {
  return `import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export function App(props, { signal }) {
  const count = signal(0);

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
      <h1 class="text-4xl font-bold">Vite + PreffX</h1>
      <button
        class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-100 dark:bg-gray-800 cursor-pointer transition-[border-color] duration-250 hover:border-[#646cff] active:outline-4 active:outline-[#646cff]"
        onClick={() => { count.value += 1 }}
      >
        count is {count}
      </button>
      <p>
        Edit <code>src/App.jsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for vite.config.js.
 */
export function viteConfigJsTemplate(css) {
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
  oxc: {
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
})
`;
}