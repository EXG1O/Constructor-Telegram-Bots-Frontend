# Contributing

Thank you for considering contributing!<br>
We appreciate your help in making this [project](https://constructor.exg1o.org/) better.

## Requirements

- Linux
- [Node.js](https://nodejs.org/) 24

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/EXG1O/Constructor-Telegram-Bots-Frontend.git
cd Constructor-Telegram-Bots-Frontend
```

### 2. Configure environment variables

Copy the `.env.example` file to `.env` and configure it with your settings:

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
npm ci
```

## Usage

To run the development server and make live changes:

```bash
npm run start
```

To build for production:

```bash
npm run build
```

## Code Formatting and Linting

We use **Prettier** as a code formatter and **ESLint** as a linter.

### Prettier

To check your code for formatting issues:

```bash
npx prettier ./src --check
```

To auto-fix formatting issues:

```bash
npx prettier ./src --write
```

### ESLint

To check your code for linting issues:

```bash
npx eslint ./src
```

To auto-fix linting issues:

```bash
npx eslint ./src --fix
```

### Run all checks

To run all code quality checks (formatting and linting) at once, you can use:

```bash
npx prettier ./src --check && npx eslint ./src
```

## Translations

To improve existing translations, you can find all locale files in the `src/locale` directory.

## Pull Requests

When submitting a PR, ensure that:

1. Your code follows the project's coding standards.
2. Your changes are well-documented with clear commit messages.
3. Each PR should address a single issue or feature.
