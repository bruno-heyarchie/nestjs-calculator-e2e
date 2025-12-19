# TypeScript Configuration

This document describes the TypeScript configuration for the NestJS Calculator API project.

## Configuration Files

### tsconfig.json
The main TypeScript configuration file with comprehensive strict type checking enabled.

### tsconfig.build.json
Build-specific configuration that extends the main config and excludes test files.

## Strict Type Checking

All strict TypeScript compiler options are enabled:

- **strict**: Master switch for all strict type-checking options
- **noImplicitAny**: Error on expressions with implied 'any' type
- **strictNullChecks**: Enable strict null checking
- **strictFunctionTypes**: Enable strict checking of function types
- **strictBindCallApply**: Enable strict 'bind', 'call', and 'apply' methods
- **strictPropertyInitialization**: Ensure class properties are initialized
- **noImplicitThis**: Error on 'this' with implied 'any' type
- **alwaysStrict**: Parse in strict mode and emit "use strict"

## Additional Strict Checks

- **noUnusedLocals**: Report errors on unused local variables
- **noUnusedParameters**: Report errors on unused parameters
- **noImplicitReturns**: Report error when not all code paths return a value
- **noFallthroughCasesInSwitch**: Report errors for fallthrough cases in switch
- **noUncheckedIndexedAccess**: Include 'undefined' in index signatures
- **noImplicitOverride**: Ensure override members are marked with override
- **noPropertyAccessFromIndexSignature**: Require indexed access for dynamic properties

## Module Configuration

- **module**: nodenext (modern ES module support)
- **moduleResolution**: nodenext (Node.js ESM resolution)
- **target**: ES2023 (modern JavaScript features)
- **esModuleInterop**: true (better CommonJS/ES module interop)
- **isolatedModules**: true (ensure each file can be transpiled independently)

## Decorator Support

NestJS relies heavily on decorators, which are properly configured:

- **experimentalDecorators**: true
- **emitDecoratorMetadata**: true

## Path Mapping

Clean imports are configured with path aliases:

```typescript
"paths": {
  "@/*": ["src/*"],
  "@app/*": ["src/app/*"],
  "@config/*": ["src/config/*"],
  "@common/*": ["src/common/*"]
}
```

Usage example:
```typescript
import { Logger } from '@common/logger';
import { AppConfig } from '@config/app.config';
```

## Build Configuration

- **outDir**: ./dist (compiled output directory)
- **declaration**: true (generate .d.ts files)
- **sourceMap**: true (generate source maps for debugging)
- **removeComments**: true (strip comments in production)
- **incremental**: true (faster rebuilds)

## File Inclusion/Exclusion

- **include**: src/**/* (all source files)
- **exclude**: node_modules, dist, test (build artifacts and dependencies)

## Benefits

This strict configuration provides:

1. **Early Error Detection**: Type errors caught at compile time
2. **Better IDE Support**: Enhanced autocomplete and type inference
3. **Code Quality**: Enforces best practices and prevents common bugs
4. **Maintainability**: Self-documenting code through explicit types
5. **Refactoring Safety**: Type system catches breaking changes

## Validation

The strict configuration successfully catches type errors during compilation:

```bash
npm run build
```

The compiler will report any type violations, ensuring code quality before runtime.

## Acceptance Criteria Met

✅ TypeScript configured with strict mode enabled
✅ Decorator support enabled for NestJS
✅ Path mapping configured for clean imports (@/ aliases)
✅ Build output configuration set to ./dist
✅ Strict compiler options catching type errors as intended
