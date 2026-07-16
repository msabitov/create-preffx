/**
 * Utility functions for create-preffx.
 */

import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Copy all files from source to destination directory recursively.
 *
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 */
export function copyAssetFiles(srcDir, destDir) {
  if (!existsSync(srcDir)) return;

  mkdirSync(destDir, { recursive: true });

  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isFile()) {
      copyFileSync(srcPath, destPath);
    } else if (entry.isDirectory()) {
      copyAssetFiles(srcPath, destPath);
    }
  }
}

/**
 * Validate that a project name is a valid npm package name.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isValidProjectName(name) {
  return /^[a-z0-9-._]+$/i.test(name) && name.length > 0 && name.length <= 214;
}

/**
 * Sanitize a project name to be a valid npm package name.
 *
 * @param {string} name
 * @returns {string}
 */
export function sanitizeProjectName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-._]/g, '')
    .replace(/^[^a-z0-9]+/, '')
    .replace(/[^a-z0-9]+$/, '')
    .slice(0, 214) || 'my-preffx-app';
}