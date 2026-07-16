/**
 * CLI argument parser for create-preffx.
 * Parses process.argv without external dependencies.
 */

import { detectAvailablePMs } from './package-manager.js';

const VALID_CSS = new Set(['none', 'modules', 'tailwind']);
const VALID_PM = new Set(['npm', 'yarn', 'pnpm', 'bun']);

/**
 * Parse CLI arguments and return an options object.
 * Supports both interactive and non-interactive modes.
 *
 * @param {string[]} args - process.argv.slice(2)
 * @returns {object} Parsed options
 */
export function runCLI(args) {
  const options = {
    projectName: null,
    language: null,       // null = prompt, 'ts' | 'js'
    css: null,            // null = prompt, 'none' | 'modules' | 'tailwind'
    pkgManager: null,     // null = prompt, 'npm' | 'yarn' | 'pnpm' | 'bun'
    noInstall: false,
    help: false,
    version: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case '--js':
        options.language = 'js';
        i++;
        break;

      case '--css':
        if (i + 1 >= args.length) {
          throw new Error('--css requires a value: none, modules, or tailwind');
        }
        const cssVal = args[i + 1].toLowerCase();
        if (!VALID_CSS.has(cssVal)) {
          throw new Error(`Invalid CSS option: "${cssVal}". Valid: none, modules, tailwind`);
        }
        options.css = cssVal;
        i += 2;
        break;

      case '--pm':
        if (i + 1 >= args.length) {
          throw new Error('--pm requires a value: npm, yarn, pnpm, or bun');
        }
        const pmVal = args[i + 1].toLowerCase();
        if (!VALID_PM.has(pmVal)) {
          throw new Error(`Invalid package manager: "${pmVal}". Valid: npm, yarn, pnpm, bun`);
        }
        // Check if the specified PM is actually installed
        const availablePMs = detectAvailablePMs();
        if (!availablePMs.includes(pmVal)) {
          console.error(`⚠ Warning: "${pmVal}" does not appear to be installed. Available: ${availablePMs.join(', ') || 'none'}`);
        }
        options.pkgManager = pmVal;
        i += 2;
        break;

      case '--no-install':
        options.noInstall = true;
        i++;
        break;

      case '--help':
      case '-h':
        options.help = true;
        i++;
        break;

      case '--version':
      case '-v':
        options.version = true;
        i++;
        break;

      default:
        // First non-flag argument is the project name
        if (arg.startsWith('--')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        if (options.projectName === null) {
          options.projectName = arg;
        } else {
          throw new Error(`Unexpected argument: ${arg}`);
        }
        i++;
        break;
    }
  }

  return options;
}