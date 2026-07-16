/**
 * TypeScript-specific templates for create-preffx.
 */

/**
 * Template for src/main.tsx.
 */
export function mainTsxTemplate() {
  return `import { createRoot } from 'preffx'
import './index.css'
import { App } from './App'

const root = createRoot(document.getElementById('app') as HTMLElement);
root.mount(App);
`;
}

/**
 * Template for src/App.tsx (plain CSS).
 */
export function appTsxTemplate() {
  return `import type { PC } from 'preffx'
import './App.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { signal }) => {
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
        Edit <code>src/App.tsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.tsx (CSS Modules).
 */
export function appTsxModuleCssTemplate() {
  return `import type { PC } from 'preffx'
import styles from './App.module.css'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { signal }) => {
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
        Edit <code>src/App.tsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for src/App.tsx (Tailwind CSS).
 */
export function appTsxTailwindTemplate() {
  return `import type { PC } from 'preffx'
import viteLogo from './assets/vite-logo.svg'
import preffxLogo from './assets/preffx-logo.svg'

export const App: PC = (props, { signal }) => {
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
        Edit <code>src/App.tsx</code> to test hot module replacement
      </p>
    </div>
  );
};
`;
}

/**
 * Template for vite.config.ts.
 */
export function viteConfigTsTemplate(css) {
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

/**
 * Template for tsconfig.json.
 */
export function tsconfigJsonTemplate() {
  return `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`;
}

/**
 * Template for tsconfig.app.json.
 */
export function tsconfigAppJsonTemplate() {
  return `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "preffx"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preffx",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`;
}

/**
 * Template for tsconfig.node.json.
 */
export function tsconfigNodeJsonTemplate() {
  return `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
`;
}