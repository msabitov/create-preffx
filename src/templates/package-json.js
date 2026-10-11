/**
 * Package.json builder for create-preffx.
 * Constructs the full package.json content based on user options.
 */

/**
 * Build a package.json object based on project options.
 *
 * @param {string} projectName
 * @param {string} language - 'ts' | 'js'
 * @param {string} css - 'none' | 'modules' | 'tailwind'
 * @param {boolean} ssr - whether to scaffold an SSR (Vite SSR) project
 * @returns {object} package.json content
 */
export function buildPackageJson(projectName, language, css, ssr = false) {
  const isTs = language === 'ts';
  const isTailwind = css === 'tailwind';

  let scripts;
  if (ssr) {
    const entryServer = isTs ? 'src/entry-server.tsx' : 'src/entry-server.jsx';
    scripts = {
      dev: 'node server.js',
      // Client bundle + SSR server bundle into .output
      build: `vite build && vite build --ssr ${entryServer} --outDir dist-server`,
      preview: 'cross-env NODE_ENV=production node server.js',
    };
    if (isTs) {
      scripts.build = `tsc -b && ${scripts.build}`;
    }
  } else {
    scripts = {
      dev: 'vite',
      build: isTs ? 'tsc -b && vite build' : 'vite build',
      preview: 'vite preview',
    };
  }

  const pkg = {
    name: projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts,
    dependencies: {
      preffx: '^0.8.1',
    },
    devDependencies: {
      vite: '^8.0.0',
    },
  };

  if (ssr) {
    pkg.dependencies.express = '^4.21.2';
  }

  if (isTs) {
    pkg.devDependencies.typescript = '~6.0.0';
    pkg.devDependencies['@types/node'] = '^24.0.0';
  }

  if (ssr) {
    pkg.devDependencies['cross-env'] = '^7.0.3';
    if (isTs) {
      pkg.devDependencies['@types/express'] = '^5.0.0';
    }
  }

  if (isTailwind) {
    pkg.devDependencies.tailwindcss = '^4.0.0';
    pkg.devDependencies['@tailwindcss/vite'] = '^4.0.0';
  }

  return pkg;
}