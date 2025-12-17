# Contributing to Calculator API

Thank you for your interest in contributing to the Calculator API project! This document provides guidelines and instructions for setting up your development environment and contributing to the project.

## Development Environment Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd calculator-api
```

2. Install dependencies:
```bash
npm install
```

3. Install Git hooks:
```bash
npm run prepare
```

## Development Workflow

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Code Quality

#### Linting

The project uses ESLint with TypeScript support and Prettier integration.

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

#### Formatting

The project uses Prettier for code formatting.

```bash
# Format all files
npm run format

# Check formatting (without modifying files)
npm run format -- --check
```

#### Type Checking

TypeScript is configured with strict mode for better type safety.

```bash
# Build the project (includes type checking)
npm run build
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Run all tests (unit + e2e)
npm run test:all
```

## Git Workflow

### Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Examples:**
```
feat(calculator): add division endpoint
fix(validation): handle division by zero error
docs: update API documentation
test(calculator): add unit tests for multiply operation
```

### Git Hooks

The project uses Husky for Git hooks:

#### Pre-commit Hook
Automatically runs before each commit:
- Lints the code
- Formats the code with Prettier

#### Commit-msg Hook
Validates commit messages against the Conventional Commits specification.

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use async/await over promises when possible
- Avoid `any` type unless absolutely necessary
- Use descriptive variable and function names

### NestJS Best Practices

- Follow the module-based architecture
- Use dependency injection
- Implement DTOs for request/response validation
- Write unit tests for services and controllers
- Use decorators for metadata and validation

### File Organization

```
src/
├── modules/           # Feature modules
│   └── calculator/    # Calculator module
│       ├── calculator.controller.ts
│       ├── calculator.service.ts
│       ├── calculator.module.ts
│       ├── dto/       # Data Transfer Objects
│       └── tests/     # Module-specific tests
├── common/            # Shared utilities
├── filters/           # Exception filters
├── guards/            # Route guards
├── interceptors/      # Request/response interceptors
├── pipes/             # Custom pipes
└── main.ts            # Application entry point
```

## IDE Configuration

### VS Code

The project includes VS Code settings in `.vscode/`:

- **settings.json**: Editor configuration for consistent formatting
- **extensions.json**: Recommended extensions
- **launch.json**: Debug configurations

Recommended extensions:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- EditorConfig for VS Code

### Debug Configuration

Use the following VS Code debug configurations:

1. **Debug NestJS**: Start the application in debug mode
2. **Jest Current File**: Debug the currently open test file
3. **Jest All**: Debug all tests

## Troubleshooting

### Common Issues

1. **Lint errors after commit**
   - Run `npm run lint` to check for issues
   - Run `npm run format` to auto-fix formatting

2. **Git hooks not running**
   - Ensure Husky is installed: `npm run prepare`
   - Check `.husky/` directory exists

3. **TypeScript errors**
   - Run `npm run build` to see all type errors
   - Ensure `tsconfig.json` is properly configured

## Getting Help

If you need help or have questions:

1. Check the project documentation
2. Review existing issues and pull requests
3. Create a new issue with a detailed description

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
