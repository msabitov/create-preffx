/**
 * Generator — creates the project files based on user options.
 */

import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { buildPackageJson } from './templates/package-json.js';
import { htmlTemplate, htmlTemplateJs, indexCssTemplate, indexCssTailwindTemplate, appCssTemplate, appModuleCssTemplate } from './templates/shared.js';
import { mainTsxTemplate, appTsxTemplate, appTsxModuleCssTemplate, appTsxTailwindTemplate, viteConfigTsTemplate, tsconfigJsonTemplate, tsconfigAppJsonTemplate, tsconfigNodeJsonTemplate } from './templates/ts.js';
import { mainJsxTemplate, appJsxTemplate, appJsxModuleCssTemplate, appJsxTailwindTemplate, viteConfigJsTemplate } from './templates/js.js';
import { copyAssetFiles } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generate the complete project at the given path.
 *
 * @param {object} options
 * @param {string} options.projectName
 * @param {string} options.language - 'ts' | 'js'
 * @param {string} options.css - 'none' | 'modules' | 'tailwind'
 * @param {string} options.pkgManager - 'npm' | 'yarn' | 'pnpm' | 'bun'
 * @returns {Promise<string>} The project path
 */
export async function generateProject(options) {
  const { projectName, language, css } = options;
  const projectPath = join(process.cwd(), projectName);

  const isTs = language === 'ts';
  const isTailwind = css === 'tailwind';
  const isModules = css === 'modules';

  // 1. Create directory structure
  const dirs = ['public', 'src/assets', 'src/components'];
  dirs.forEach((dir) => {
    mkdirSync(join(projectPath, dir), { recursive: true });
  });

  // 2. Write package.json
  const pkg = buildPackageJson(projectName, language, css);
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

  // 3. Write index.html
  const html = isTs ? htmlTemplate(projectName) : htmlTemplateJs(projectName);
  writeFileSync(join(projectPath, 'index.html'), html);

  // 4. Write vite.config
  const viteConfig = isTs
    ? viteConfigTsTemplate(css)
    : viteConfigJsTemplate(css);
  const viteExt = isTs ? 'ts' : 'js';
  writeFileSync(join(projectPath, `vite.config.${viteExt}`), viteConfig);

  // 5. Write src/main
  const mainContent = isTs ? mainTsxTemplate() : mainJsxTemplate();
  writeFileSync(join(projectPath, `src/main.${isTs ? 'tsx' : 'jsx'}`), mainContent);

  // 6. Write src/App
  let appContent;
  if (isModules) {
    appContent = isTs ? appTsxModuleCssTemplate() : appJsxModuleCssTemplate();
  } else if (isTailwind) {
    appContent = isTs ? appTsxTailwindTemplate() : appJsxTailwindTemplate();
  } else {
    appContent = isTs ? appTsxTemplate() : appJsxTemplate();
  }
  writeFileSync(join(projectPath, `src/App.${isTs ? 'tsx' : 'jsx'}`), appContent);

  // 7. Write CSS files
  // index.css
  if (isTailwind) {
    writeFileSync(join(projectPath, 'src/index.css'), indexCssTailwindTemplate());
  } else {
    writeFileSync(join(projectPath, 'src/index.css'), indexCssTemplate());
  }

  // App.css or App.module.css
  if (isModules) {
    writeFileSync(join(projectPath, 'src/App.module.css'), appModuleCssTemplate());
  } else if (!isTailwind) {
    writeFileSync(join(projectPath, 'src/App.css'), appCssTemplate());
  }
  // Tailwind doesn't need App.css — uses Tailwind utility classes directly

  // 8. Write tsconfig files (TS only)
  if (isTs) {
    writeFileSync(join(projectPath, 'tsconfig.json'), tsconfigJsonTemplate());
    writeFileSync(join(projectPath, 'tsconfig.app.json'), tsconfigAppJsonTemplate());
    writeFileSync(join(projectPath, 'tsconfig.node.json'), tsconfigNodeJsonTemplate());
  }

  // 9. Copy SVG assets
  const assetDir = join(__dirname, '..', 'assets');
  if (existsSync(assetDir)) {
    copyAssetFiles(assetDir, join(projectPath, 'src', 'assets'));
  }

  // 10. Write favicon.svg
  writeFileSync(join(projectPath, 'public', 'favicon.svg'), faviconSvg());

  return projectPath;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">` +
    `<path fill="#7fbfbf" d="M0 0h128v128H0z"/>` +
    `<path fill="#80bfbf" d="M0 43h85v85H0z"/>` +
    `<path fill="#028080" d="M85 85h43v43H85zM0 85h43v43H0zM0 0h43v43H0z"/>` +
    `<path fill="#80bfbf" d="M43 85h42v43H43z"/>` +
    `<path fill="#fff" d="M43 43h42v42H43z"/>` +
  `</svg>`;
}