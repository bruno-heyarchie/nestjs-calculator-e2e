# Calculator REST API

A NestJS-based REST API calculator application providing basic arithmetic operations through HTTP endpoints.

## Description

This project implements a RESTful API calculator using the NestJS framework. It provides endpoints for performing basic arithmetic operations (addition, subtraction, multiplication, and division) with comprehensive testing and deployment capabilities.

## Tech Stack

- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Testing**: Jest (unit and e2e tests)
- **Code Quality**: ESLint, Prettier

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build

```bash
$ npm run build
```

## Project Structure

```
calculator-api/
├── src/
│   ├── app.controller.ts      # Main application controller
│   ├── app.controller.spec.ts # Controller unit tests
│   ├── app.module.ts           # Root application module
│   ├── app.service.ts          # Application service layer
│   └── main.ts                 # Application entry point
├── test/
│   ├── app.e2e-spec.ts        # End-to-end tests
│   └── jest-e2e.json          # E2E test configuration
├── .gitignore                 # Git ignore patterns
├── .prettierrc                # Prettier configuration
├── eslint.config.mjs          # ESLint configuration
├── nest-cli.json              # NestJS CLI configuration
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── tsconfig.build.json        # TypeScript build configuration
```

## API Endpoints

The application runs on `http://localhost:3000` by default.

- `GET /` - Health check endpoint

## Development

This project follows NestJS best practices and conventions:

- **Modular architecture**: Code is organized into modules for better maintainability
- **Dependency injection**: Services are injectable and easily testable
- **TypeScript**: Full type safety and modern JavaScript features
- **Testing**: Comprehensive unit and e2e test coverage
- **Code quality**: ESLint and Prettier for consistent code style

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord Channel](https://discord.gg/nestjs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
