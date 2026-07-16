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
 * @returns {object} package.json content
 */
export function buildPackageJson(projectName, language, css) {
  const isTs = language === 'ts';
  const isTailwind = css === 'tailwind';

  const pkg = {
    name: projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: isTs ? 'tsc -b && vite build' : 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      preffx: '^0.4.0',
    },
    devDependencies: {
      vite: '^8.0.0',
    },
  };

  if (isTs) {
    pkg.devDependencies.typescript = '~6.0.0';
    pkg.devDependencies['@types/node'] = '^24.0.0';
  }

  if (isTailwind) {
    pkg.devDependencies.tailwindcss = '^4.0.0';
    pkg.devDependencies['@tailwindcss/vite'] = '^4.0.0';
  }

  return pkg;
}