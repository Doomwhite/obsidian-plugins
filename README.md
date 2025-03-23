Let’s create a comprehensive `README.md` for your project, `@my-monorepo/obsidian-plugins`. The README will provide an overview of the project, setup instructions, script usage, and contribution guidelines. It will reflect the monorepo structure, the use of Biome for linting and formatting, and the workflows you’ve set up for GitHub Actions.

---

### `README.md`

```markdown
# @my-monorepo/obsidian-plugins

A monorepo for building and managing Obsidian plugins using TypeScript, PNPM, and Biome.

## Overview

This project is a monorepo containing multiple Obsidian plugins and shared utilities. It uses PNPM for dependency management, TypeScript for type safety, and Biome for linting and formatting. The monorepo structure allows for shared code between plugins while maintaining separate builds for each plugin.

### Packages
- **`@my-monorepo/common`**: A shared utility library used by the plugins.
- **`@my-monorepo/plugin1`**: An example Obsidian plugin.

## Prerequisites

- **Node.js**: Version 16.20.2 or higher (recommend upgrading to the latest LTS, e.g., 20.x).
- **PNPM**: Version 10.6.5 (specified in `packageManager`).

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd obsidian-plugins
```

### 2. Install Dependencies
Install dependencies using PNPM:
```bash
pnpm install
```

### 3. Build the Project
Build all packages in the monorepo:
```bash
pnpm build
```

### 4. Develop a Plugin
Run the development script for a specific plugin (e.g., `plugin1`):
```bash
pnpm dev:plugin1
```
This will start the development server for `plugin1` and watch for changes.

## Linting and Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Biome ensures consistent code style and catches potential issues in TypeScript and JavaScript files.

- **Configuration**: See `biome.json` in the root for linting and formatting rules.
- **Formatting Rules**:
  - 2-space indentation
  - Single quotes
  - Semicolons required
  - 80-character line width
- **Linting Rules**:
  - Recommended Biome rules enabled
  - `noNonNullAssertion` disabled
  - `noExplicitAny` set to warn

To format and lint your code:
```bash
pnpm format
pnpm lint
```

To check for issues without fixing them (useful in CI):
```bash
pnpm lint:check
```

## Project Structure

```
obsidian-plugins/
├── packages/
│   ├── common/               # Shared utilities (@my-monorepo/common)
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── plugins/
│       └── plugin1/          # Example plugin (@my-monorepo/plugin1)
│           ├── src/
│           │   └── main.ts
│           └── package.json
├── .github/
│   └── workflows/            # GitHub Actions workflows
│       ├── build.yml
│       └── lint-format.yml
├── biome.json                # Biome configuration
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml       # PNPM workspace configuration
```
