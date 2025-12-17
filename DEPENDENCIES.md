# Dependencies Management

This document describes the dependency management strategy for the Calculator REST API project.

## Package Manager

This project uses **npm** as the package manager. The use of other package managers (yarn, pnpm) is prevented through the `preinstall` script.

## Node.js Version

- **Required Version**: Node.js >= 18.0.0
- **Current Version**: 20.19.6 (specified in `.nvmrc`)
- **npm Version**: >= 9.0.0

### Version Management

Use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install the project's Node.js version
nvm install

# Use the project's Node.js version
nvm use
```

## Production Dependencies

### Core Framework
- **@nestjs/common** (^11.0.1) - NestJS common utilities and decorators
- **@nestjs/core** (^11.0.1) - NestJS core framework
- **@nestjs/platform-express** (^11.0.1) - Express adapter for NestJS

### Required Libraries
- **reflect-metadata** (^0.2.2) - Metadata reflection API for TypeScript decorators
- **rxjs** (^7.8.1) - Reactive Extensions for JavaScript

## Development Dependencies

### NestJS Tools
- **@nestjs/cli** (^11.0.0) - NestJS command-line interface
- **@nestjs/schematics** (^11.0.0) - NestJS code generation schematics
- **@nestjs/testing** (^11.0.1) - Testing utilities for NestJS

### TypeScript & Build Tools
- **typescript** (^5.7.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution environment
- **ts-loader** (^9.5.2) - TypeScript loader for webpack
- **ts-jest** (^29.2.5) - Jest transformer for TypeScript
- **tsconfig-paths** (^4.2.0) - Load modules according to tsconfig paths

### Testing
- **jest** (^30.0.0) - JavaScript testing framework
- **supertest** (^7.0.0) - HTTP assertion library for testing APIs
- **@types/jest** (^30.0.0) - TypeScript definitions for Jest
- **@types/supertest** (^6.0.2) - TypeScript definitions for Supertest

### Code Quality
- **eslint** (^9.18.0) - JavaScript/TypeScript linter
- **typescript-eslint** (^8.20.0) - ESLint plugin for TypeScript
- **prettier** (^3.4.2) - Code formatter
- **eslint-config-prettier** (^10.0.1) - Disable ESLint rules that conflict with Prettier
- **eslint-plugin-prettier** (^5.2.2) - Run Prettier as an ESLint rule

### Git Hooks & Commit Standards
- **husky** (^9.1.7) - Git hooks manager
- **@commitlint/cli** (^20.2.0) - Commit message linter
- **@commitlint/config-conventional** (^20.2.0) - Conventional commit rules

### Type Definitions
- **@types/node** (^22.10.7) - TypeScript definitions for Node.js
- **@types/express** (^5.0.0) - TypeScript definitions for Express

### Other
- **source-map-support** (^0.5.21) - Adds source map support for stack traces
- **globals** (^16.0.0) - Global identifiers from different JavaScript environments

## Dependency Version Strategy

### Semantic Versioning
We use semantic versioning with the caret (^) prefix:
- `^11.0.1` allows updates to `11.x.x` (minor and patch updates)
- This balances stability with security updates and bug fixes

### Version Pinning
- **package-lock.json** is committed to ensure consistent installations across environments
- All team members and CI/CD pipelines use identical dependency versions

## Security

### Audit Scripts
```bash
# Check for security vulnerabilities
npm run audit

# Automatically fix vulnerabilities
npm run audit:fix
```

### Audit Configuration
- Audit level set to `moderate` - alerts on moderate, high, and critical vulnerabilities
- Regular security audits should be run before deployments

## Dependency Management Scripts

### Checking for Updates
```bash
# Check for outdated dependencies
npm run deps:check
```

### Updating Dependencies
```bash
# Update dependencies within version constraints
npm run deps:update
```

### Manual Updates
For major version updates, manually edit `package.json` and run:
```bash
npm install
```

## Best Practices

1. **Regular Updates**: Check for dependency updates monthly
2. **Security First**: Run `npm audit` before each deployment
3. **Test After Updates**: Run full test suite after dependency updates
4. **Review Changes**: Check changelogs for breaking changes before updating
5. **Lock File**: Always commit `package-lock.json` changes
6. **Engine Strict**: The project enforces Node.js and npm version requirements

## Configuration Files

### .npmrc
Project-specific npm configuration:
- Engine strict mode enabled
- Audit enabled with moderate severity level
- Package lock enabled
- Save prefix set to `^` for semver ranges

### .nvmrc
Specifies the exact Node.js version (20.19.6) for the project.

## Troubleshooting

### Clean Installation
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force

# Fresh install
npm install
```

### Version Conflicts
If you encounter version conflicts:
1. Check that you're using the correct Node.js version (`node --version`)
2. Ensure npm is up to date (`npm --version`)
3. Try a clean installation (see above)

## CI/CD Considerations

- Use `npm ci` instead of `npm install` in CI/CD pipelines for faster, more reliable builds
- Cache `node_modules` based on `package-lock.json` hash
- Run `npm audit` as part of the CI/CD pipeline
- Enforce the `engine-strict` setting in CI/CD environments
