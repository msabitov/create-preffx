/**
 * Template for index.html (shared between JS and TS).
 */

export function htmlTemplate(projectName) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Template for index.html (JS version).
 */
export function htmlTemplateJs(projectName) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

/**
 * Template for src/index.css (without Tailwind).
 */
export function indexCssTemplate() {
  return `*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.5;
  color-scheme: light dark;
  color: #213547;
  background-color: #ffffff;
}

body {
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }
}
`;
}

/**
 * Template for src/index.css (with Tailwind).
 */
export function indexCssTailwindTemplate() {
  return `@import "tailwindcss";

:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.5;
  color-scheme: light dark;
}

body {
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  body {
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }
}
`;
}

/**
 * Template for src/App.css (plain CSS, shared between JS and TS).
 */
export function appCssTemplate() {
  return `.logo {
  height: 10rem;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.preffx:hover {
  filter: drop-shadow(0 0 2em #0099e5aa);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2em;
}

.logos {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2.25rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:active {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: dark) {
  button {
    background-color: #1a1a1a;
  }
}
`;
}

/**
 * Template for src/App.module.css (CSS Modules).
 */
export function appModuleCssTemplate() {
  return `.logo {
  height: 10rem;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logoPreffx:hover {
  filter: drop-shadow(0 0 2em #0099e5aa);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2em;
}

.logos {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2.25rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:active {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: dark) {
  button {
    background-color: #1a1a1a;
  }
}
`;
}