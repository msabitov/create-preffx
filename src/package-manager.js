/**
 * Package manager runner for create-preffx.
 * Installs dependencies in the generated project folder
 * with a simple live spinner indicator.
 */

import { spawn, execSync } from 'child_process';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

const PM_COMMANDS = {
  npm: 'npm',
  yarn: 'yarn',
  pnpm: 'pnpm',
  bun: 'bun',
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
      execSync(`${pm} --version`, { stdio: 'pipe', timeout: 5000 });
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
 * Run an async install.
 * @param {string} projectPath - Absolute path to the generated project
 * @param {string} pkgManager - 'npm' | 'yarn' | 'pnpm' | 'bun'
 * @returns {Promise<void>} Resolves on success, throws on install failure
 */
function runInstall(projectPath, pkgManager) {
  const args = ['install'];

  return new Promise((resolve, reject) => {
    const child = spawn(PM_COMMANDS[pkgManager], args, {
      cwd: projectPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '1' },
      shell: process.platform === 'win32',
    });

    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else {
        const err = new Error(`Install exited with code ${code}`);
        err.stderr = Buffer.from(stderr);
        reject(err);
      }
    });
  });
}

/**
 * Install dependencies in the project directory.
 *
 * @param {string} projectPath - Absolute path to the generated project
 * @param {string} pkgManager - 'npm' | 'yarn' | 'pnpm' | 'bun'
 * @returns {Promise<void>}
 */
export async function installDependencies(projectPath, pkgManager) {
  const spin = spinner();
  spin.start(`Installing dependencies with ${pc.cyan(PM_COMMANDS[pkgManager])}…`);

  try {
    await runInstall(projectPath, pkgManager);
    spin.stop('Dependencies installed');
  } catch (err) {
    spin.stop('Installation failed');
    console.error(`\n  ${pc.red('Installation failed.')}\n`);
    const stderr = err.stderr?.toString() || err.message;
    if (stderr) console.error(`${pc.dim(stderr)}\n`);
    throw err;
  }
}