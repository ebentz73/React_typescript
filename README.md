# Frosted Web

FusionJS web application using BaseWeb design system and TypeScript. Powers the web app for Frosted Affair and backend server.

## Deps
- FusionJS docs: https://fusionjs.com
- BaseWeb docs: https://baseweb.design
- MongoDB:
```
brew tap mongodb/brew
brew install mongodb-community@4.2
brew services start mongodb-community
```

## Command Line
Use Node 8 (`nvm use 8`)
- Run `yarn` or `yarn install` to install / update dependencies
- Run server: `yarn dev`
- Run tests: `yarn test`
- Run specific tests: `yarn test --match filename`
- Check types with TypeScript: `yarn check-types`
- Check lint rules: `yarn lint`

## Chrome Setup
Extensions:
* React dev tools
* Apollo dev tools

## VSCode Environment Setup

Extensions:
* ESLint

Settings:
```
{
{
    "editor.formatOnSave": false,
    "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
    "editor.formatOnType": true,
    "editor.tabSize": 2,
    "files.autoSave": "onFocusChange",
    "files.trimTrailingWhitespace": true,
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ],
}
}
```

Tasks:
```
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "type": "shell",
      "label": "debug-dev",
      "command": "yarn dev --debug",
      "problemMatcher": []
    },
    {
      "type": "shell",
      "label": "dev",
      "command": "yarn dev",
      "problemMatcher": []
    },
    {
      "type": "shell",
      "label": "debug-test",
      "command": "yarn test --debug --match ${input:testName}",
      "problemMatcher": []
    },
    {
      "type": "shell",
      "label": "test",
      "command": "yarn test --match ${input:testName}",
      "problemMatcher": []
    },
    {
      "type": "shell",
      "label": "cover",
      "command": "yarn cover",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "testName",
      "description": "Enter the test name or a matching string for the tests you want to run",
      "default": "/",
      "type": "promptString"
    }
  ]
}
```