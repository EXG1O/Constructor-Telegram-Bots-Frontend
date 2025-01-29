# Contributing
Thank you for considering contributing!<br>
We appreciate your help in making this project better.

## Installing
Deploy the project by following the "[Installing](README.md#installing)" section, but instead of building the frontend, use the command for run the frontend server to make live changes. You'll also need to deploy the backend by following the "[Installing](https://github.com/EXG1O/Constructor-Telegram-Bots/blob/master/CONTRIBUTING.md#installing)" section.

## Code Formatting and Linting
To maintain a consistent code style, we use **Prettier** as a code formatter and **ESLint** as a linter.

### Prettier
To check your code for formatting issues, run the following command:
```bash
npx prettier ./src --check
```
This will list any issues that need to be addressed.

To auto-fix these issues, run the following command:
```bash
npx prettier ./src --write
```

### ESLint
To check your code for linting issues, run the following command:
```bash
npx eslint ./src
```
This will list any issues that need to be addressed.

To auto-fix these issues, run the following command:
```bash
npx eslint ./src --fix
```

## Translations
If you'd like to contribute by improving translations, you can find all locale files in the `./src/locale` directory.

## Pull Requests
When submitting a PR, please ensure that:
1. Your code follows the project's coding standards.
2. Your changes are well-documented.
