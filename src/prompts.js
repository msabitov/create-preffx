/**
 * Interactive prompts for create-preffx.
 * Uses @clack/prompts for a polished CLI experience.
 */

import { text, select, isCancel, cancel } from '@clack/prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import { detectAvailablePMs } from './package-manager.js';

const VALID_PROJECT_NAME = /^[a-z0-9-._]+$/i;
const DEFAULT_PROJECT_NAME = 'my-preffx-app';

/**
 * Find the next available project name by scanning existing directories.
 * E.g. if my-preffx-app, my-preffx-app-1 already exist, suggests my-preffx-app-2.
 *
 * @param {string} baseName - Base project name to check
 * @returns {string} Next available name
 */
function getNextAvailableName(baseName) {
  let name = baseName;
  let counter = 0;

  while (existsSync(join(process.cwd(), name))) {
    counter++;
    name = `${baseName}-${counter}`;
  }

  return name;
}

/**
 * Prompt the user for project options.
 * When a value is already provided via CLI args (non-interactive), it is skipped.
 *
 * @param {object} cliOptions - Parsed CLI arguments
 * @returns {Promise<object|null>} Project options or null if cancelled
 */
export async function getProjectOptions(cliOptions) {
  const options = {};

  // Project name
  options.projectName = cliOptions.projectName;
  if (!options.projectName) {
    const defaultName = getNextAvailableName(DEFAULT_PROJECT_NAME);
    const suggested = defaultName !== DEFAULT_PROJECT_NAME
      ? defaultName
      : null;

    options.projectName = await text({
      message: suggested
        ? `Project name (suggested: ${suggested})`
        : 'Project name',
      placeholder: defaultName,
      defaultValue: defaultName,
      validate: (value) => {
        if (!value || !value.trim()) return 'Project name is required';
        if (!VALID_PROJECT_NAME.test(value.trim())) {
          return 'Project name may only contain letters, numbers, dots, hyphens, and underscores';
        }
        if (existsSync(join(process.cwd(), value.trim()))) {
          return `Directory "${value.trim()}" already exists. Please choose a different name or remove it first.`;
        }
      },
    });

    if (isCancel(options.projectName)) {
      cancel('Operation cancelled.');
      return null;
    }
  } else {
    // Check CLI-provided project name immediately
    if (existsSync(join(process.cwd(), options.projectName))) {
      cancel(`Directory "${options.projectName}" already exists. Please choose a different name or remove it first.`);
      return null;
    }
  }

  // Language
  options.language = cliOptions.language;
  if (!options.language) {
    options.language = await select({
      message: 'Select a language',
      initialValue: 'ts',
      options: [
        { value: 'ts', label: 'TypeScript' },
        { value: 'js', label: 'JavaScript' },
      ],
    });

    if (isCancel(options.language)) {
      cancel('Operation cancelled.');
      return null;
    }
  }

  // CSS solution
  options.css = cliOptions.css;
  if (!options.css) {
    options.css = await select({
      message: 'Select a CSS solution',
      initialValue: 'none',
      options: [
        { value: 'none', label: 'None (plain CSS)' },
        { value: 'modules', label: 'CSS Modules' },
        { value: 'tailwind', label: 'Tailwind CSS' },
      ],
    });

    if (isCancel(options.css)) {
      cancel('Operation cancelled.');
      return null;
    }
  }

  // Package manager
  options.pkgManager = cliOptions.pkgManager;
  if (!options.pkgManager) {
    const availablePMs = detectAvailablePMs();

    const pmOptions = availablePMs.map((pm) => ({ value: pm, label: pm }));

    // If only one PM is available, auto-select it without prompting
    if (pmOptions.length === 1) {
      options.pkgManager = pmOptions[0].value;
    } else {
      const initialIdx = pmOptions.findIndex((o) => o.value === 'npm');
      options.pkgManager = await select({
        message: 'Select a package manager?',
        initialValue: pmOptions[Math.max(0, initialIdx)].value,
        options: pmOptions,
      });

      if (isCancel(options.pkgManager)) {
        cancel('Operation cancelled.');
        return null;
      }
    }
  }

  return options;
}