# Development Environment Guide

This document describes the development environment setup for the NestJS Calculator API project, including hot reload, debugging, and environment configuration.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Environment Configuration

The project uses environment-specific configuration files to manage different deployment stages:

### Environment Files

- `.env.development` - Development environment configuration (local development)
- `.env.staging` - Staging environment configuration
- `.env.production` - Production environment configuration
- `.env.example` - Template file with all available environment variables
- `.env.test` - Test environment configuration (used during testing)

### Loading Environment Variables

Environment variables are automatically loaded based on the `NODE_ENV` variable:

1. The application loads `.env.${NODE_ENV}` first
2. Falls back to `.env.example` for any missing variables
3. Environment variables are loaded in `src/main.ts` using the `dotenv` package

### Available Environment Variables

```bash
# Application Configuration
NODE_ENV=development          # Environment: development, staging, production
PORT=3000                     # Server port

# API Configuration
API_PREFIX=api               # API route prefix
API_VERSION=v1               # API version

# Logging Configuration
LOG_LEVEL=debug              # Logging level: error, warn, log, debug, verbose

# CORS Configuration
CORS_ORIGIN=*                # Allowed CORS origins

# Health Check Configuration
HEALTH_CHECK_ENABLED=true    # Enable health check endpoints
HEALTH_CHECK_PATH=/health    # Health check endpoint path

# Development Tools
GENERATE_SOURCEMAP=true      # Enable source maps for debugging
HMR_ENABLED=true            # Enable Hot Module Replacement
DEBUG=true                   # Enable debug mode
```

## Development Scripts

### Starting the Application

```bash
# Standard development mode with hot reload (recommended)
npm run start:dev

# Development mode with nodemon (alternative hot reload)
npm run start:dev:nodemon

# Hot Module Replacement (HMR) mode for faster reloads
npm run start:hmr
```

### Debugging

```bash
# Start with debugger attached (port 9229)
npm run start:debug

# Start with debugger and break on first line
npm run start:debug:brk
```

### Production Deployment

```bash
# Build for production
npm run build:prod

# Start staging environment
npm run start:staging

# Start production environment
npm run start:prod
```

## Hot Reload Configuration

### NestJS Watch Mode

The project uses NestJS CLI's built-in watch mode for hot reload:

- Automatically detects changes in TypeScript files
- Recompiles and restarts the application
- Preserves console output with `--preserveWatchOutput` flag

### Nodemon Configuration

Alternative hot reload using nodemon is configured in `nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/main.ts"
}
```

Features:
- Watches `src` directory for changes
- Monitors `.ts` and `.json` files
- Ignores test files
- Custom restart command with colored output
- 1-second delay to avoid multiple restarts

### Hot Module Replacement (HMR)

HMR provides the fastest reload experience by replacing modules without full restart:

- Configured in `webpack.config.js`
- Enabled in `src/main.ts` with hot module disposal
- Best for rapid development iterations
- Use `npm run start:hmr` to enable

## Debugging with VS Code

### Debug Configurations

The project includes comprehensive VS Code debug configurations in `.vscode/launch.json`:

#### 1. Debug NestJS Application
- Launches the application with debugger attached
- Auto-restarts on file changes
- Loads `.env.development` environment variables
- Port: 9229

#### 2. Attach to NestJS Application
- Attaches to a running application
- Useful when the app is already started
- Port: 9229

#### 3. Debug NestJS with Break on Start
- Launches with debugger and breaks on first line
- Useful for debugging startup issues
- Port: 9229

#### 4. Jest Current File
- Debugs the currently open test file
- Runs in single-threaded mode (`--runInBand`)

#### 5. Jest All Tests
- Debugs all unit tests
- Runs in single-threaded mode

#### 6. Jest E2E Tests
- Debugs all end-to-end tests
- Uses E2E test configuration

### Using the Debugger

1. **Set Breakpoints**: Click in the gutter next to line numbers to set breakpoints
2. **Start Debugging**: Press `F5` or select a debug configuration from the Debug panel
3. **Debug Controls**:
   - `F5` - Continue
   - `F10` - Step Over
   - `F11` - Step Into
   - `Shift+F11` - Step Out
   - `Ctrl+Shift+F5` - Restart
   - `Shift+F5` - Stop

### Source Maps

Source maps are enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

This allows you to debug TypeScript code directly instead of compiled JavaScript.

## Development Workflow

### Typical Development Session

1. **Start Development Server**:
   ```bash
   npm run start:dev
   ```

2. **Make Code Changes**:
   - Edit files in the `src` directory
   - Server automatically restarts on save
   - Check console for compilation errors

3. **Test Your Changes**:
   ```bash
   # Run unit tests
   npm test

   # Run with coverage
   npm run test:cov

   # Run E2E tests
   npm run test:e2e
   ```

4. **Debug Issues**:
   - Set breakpoints in VS Code
   - Press `F5` to start debugging
   - Inspect variables and step through code

### Best Practices

1. **Use Environment Files**:
   - Never commit `.env.development` or `.env.production` with secrets
   - Use `.env.example` as a template
   - Keep sensitive data in environment variables

2. **Hot Reload Tips**:
   - Use `start:dev` for most development work
   - Use `start:hmr` when working on UI-intensive features
   - Use `start:dev:nodemon` if you prefer nodemon's interface

3. **Debugging Tips**:
   - Use `Debug NestJS Application` for general debugging
   - Use `Debug NestJS with Break on Start` for startup issues
   - Use `Attach to NestJS Application` when running the app separately
   - Always enable source maps for better debugging experience

4. **Performance**:
   - Hot reload is fastest with HMR
   - Standard watch mode is most stable
   - Nodemon provides the best terminal output

## Troubleshooting

### Port Already in Use

If you see "EADDRINUSE" error:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

Or change the port in `.env.development`:

```bash
PORT=3001
```

### Debugger Not Attaching

1. Ensure the application is running with debug mode:
   ```bash
   npm run start:debug
   ```

2. Check that port 9229 is not in use:
   ```bash
   lsof -i :9229
   ```

3. Verify debugger configuration in `.vscode/launch.json`

### Hot Reload Not Working

1. Check that files are being saved correctly
2. Verify nodemon/watch configuration
3. Try restarting the development server
4. Clear the `dist` directory:
   ```bash
   npm run prebuild
   npm run start:dev
   ```

### Environment Variables Not Loading

1. Verify the `.env.development` file exists
2. Check that `NODE_ENV` is set correctly
3. Restart the development server
4. Check `src/main.ts` for dotenv configuration

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Nodemon Documentation](https://nodemon.io/)
