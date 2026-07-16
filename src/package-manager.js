/**
 * Package manager runner for create-preffx.
 * Installs dependencies in the generated project folder.
 */

import { execSync } from 'child_process';
import { spinner } from '@clack/prompts';

const PM_COMMANDS = {
  npm: 'npm install',
  yarn: 'yarn install',
  pnpm: 'pnpm install',
  bun: 'bun install',
};

/**
 * Detect which package managers are available on the system.
 * Runs `<pm> --version` and checks the exit code.
 *
 * @returns {string[]} Array of available package manager keys ('npm', 'yarn', 'pnpm', 'bun')
 */
export function detectAvailablePMs() {
  const available = [];

  for (const pm of Object.keys(PM_COMMANDS)) {
    try {
      const checkCmd = pm === 'yarn' ? 'yarn --version' : `${pm} --version`;
      execSync(checkCmd, { stdio: 'pipe', timeout: 5000 });
      available.push(pm);
    } catch {
      // Package manager not available — skip
    }
  }

  // npm is almost always available, but if not detected — add as fallback
  if (!available.includes('npm')) {
    try {
      execSync('npm --version', { stdio: 'pipe', timeout: 5000 });
      available.unshift('npm');
    } catch {
      // No package manager at all — keep going
    }
  }

  return available;
}

/**
 * Install dependencies in the project directory.
 *
 * @param {string} projectPath - Absolute path to the generated project
 * @param {string} pkgManager - 'npm' | 'yarn' | 'pnpm' | 'bun'
 * @returns {Promise<void>}
 */
export async function installDependencies(projectPath, pkgManager) {
  const s = spinner();
  s.start('Installing dependencies...');

  const command = PM_COMMANDS[pkgManager];

  if (!command) {
    s.stop('Skipped: unknown package manager');
    return;
  }

  try {
    execSync(command, {
      cwd: projectPath,
      stdio: 'pipe',
      timeout: 120000, // 2 minutes timeout
    });
    s.stop('Dependencies installed');
  } catch (err) {
    s.stop('Failed to install dependencies');
    const stderr = err.stderr?.toString() || '';
    console.error(`\n  ${command} failed. Error details:\n${stderr}`);
    throw err;
  }
}