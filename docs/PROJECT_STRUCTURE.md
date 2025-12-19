# Project Structure and Architecture

This document provides detailed information about the NestJS Calculator API project structure, architectural decisions, and design patterns.

## Overview

The Calculator API follows a modular, layered architecture based on NestJS best practices. The application is organized into feature modules, each containing its own controllers, services, DTOs, and tests.

## Module Architecture

### Calculator Module
The calculator module implements all arithmetic operations with comprehensive validation and error handling.

### Health Module
Provides health check endpoints for monitoring application status.

### Common Module
Contains shared utilities, filters, and interceptors used across all modules.

## Design Patterns

1. **Module Pattern** - Feature encapsulation
2. **Dependency Injection** - Constructor-based injection
3. **DTO Pattern** - Data validation and transformation
4. **Exception Filter Pattern** - Centralized error handling
5. **Interceptor Pattern** - Cross-cutting concerns

## Directory Structure

See README.md for the complete directory tree.

## Resources

- [NestJS Module Documentation](https://docs.nestjs.com/modules)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs)
