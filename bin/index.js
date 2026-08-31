#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import { intro, outro, spinner, cancel, note, confirm } from '@clack/prompts';
import pc from 'picocolors';
import { runCLI } from '../src/cli.js';
import { getProjectOptions } from '../src/prompts.js';
import { generateProject } from '../src/generator.js';
import { installDependencies } from '../src/package-manager.js';

async function main() {
  try {
    // Parse CLI arguments
    const cliOptions = runCLI(process.argv.slice(2));

    if (cliOptions.help) {
      showHelp();
      process.exit(0);
    }

    if (cliOptions.version) {
      showVersion();
      process.exit(0);
    }

    // Show intro
    intro(pc.bgGreen(pc.black(' ⚡ create-preffx ⚡ ')));

    // Get project options (interactive or from CLI args)
    const options = await getProjectOptions(cliOptions);

    if (!options) {
      cancel('Operation cancelled.');
      process.exit(0);
    }

    // Generate project
    const s = spinner();
    s.start('Scaffolding project...');

    const projectPath = await generateProject(options);

    s.stop('Project scaffolded');

    // Install dependencies
    if (!cliOptions.noInstall) {
      await installDependencies(projectPath, options.pkgManager);
    }

    // Show success message
    const relativePath = options.projectName;
    const devCmd = `${options.pkgManager} run dev`;

    outro(`${pc.green('✔')} Project "${options.projectName}" created successfully!`);

    // Ask whether to start dev server
    const startDev = await confirm({
      message: 'Start the dev server now?',
      initialValue: true,
    });

    if (startDev) {
      note(`cd ${relativePath} && ${devCmd}`, 'Dev server');
      console.log(`\n  ${pc.dim('Starting dev server...')}\n`);

      execSync(devCmd, {
        cwd: projectPath,
        stdio: 'inherit',
      });
    } else {
      outro(
        `\n  ${pc.cyan('cd')} ${relativePath}\n` +
        `  ${pc.cyan(devCmd)}\n`
      );
      process.exit(0);
    }
  } catch (err) {
    cancel(`Error: ${err.message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
${pc.bold('Usage:')}
  ${pc.cyan('create-preffx')} [project-name] [options]

${pc.bold('Options:')}
  ${pc.cyan('--js')}              Use JavaScript (default: TypeScript)
  ${pc.cyan('--css <type>')}      CSS solution: none, modules, tailwind (default: none)
  ${pc.cyan('--pm <manager>')}    Package manager: npm, yarn, pnpm, bun (default: npm)
  ${pc.cyan('--ssr')}             Scaffold an SSR project (Vite SSR + Express)
  ${pc.cyan('--no-install')}      Skip dependency installation
  ${pc.cyan('--help')}            Show this help message
  ${pc.cyan('--version')}         Show version

${pc.bold('Examples:')}
  ${pc.dim('$')} ${pc.green('create-preffx')}
  ${pc.dim('$')} ${pc.green('create-preffx my-app')}
  ${pc.dim('$')} ${pc.green('create-preffx my-app --js --css tailwind --pm pnpm')}
  ${pc.dim('$')} ${pc.green('create-preffx my-app --ssr')}
  `);
}

function showVersion() {
  const { version } = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
  );
  console.log(version);
}

main();