# Test Coverage Configuration

This document describes the test coverage configuration and reporting for the Calculator API project.

## Coverage Configuration

### Location
Coverage settings are configured in `jest.config.ts`.

### Coverage Thresholds

The project enforces the following minimum coverage thresholds:

| Metric      | Threshold |
|-------------|-----------|
| Branches    | 80%       |
| Functions   | 80%       |
| Lines       | 80%       |
| Statements  | 80%       |

**Note:** Builds will fail if coverage falls below these thresholds when running with coverage enabled.

## Coverage Collection

### Included Files
Coverage is collected from:
- All TypeScript and JavaScript files in `src/**/*.(t|j)s`

### Excluded Files
The following file types are excluded from coverage calculation:
- Test files (`*.spec.ts`, `*.e2e-spec.ts`)
- Interface files (`*.interface.ts`)
- DTO files (`*.dto.ts`)
- Module files (`*.module.ts`)
- Entry point (`main.ts`)
- Constant files (`*.constants.ts`)
- Enum files (`*.enum.ts`)

## Coverage Reports

### Report Formats

Multiple report formats are generated for different use cases:

1. **HTML Report** (`coverage/index.html`)
   - Human-readable, interactive report
   - Best for local development and detailed analysis
   - Shows line-by-line coverage with color coding

2. **Text Report** (console output)
   - Quick feedback during test runs
   - Shows summary table in terminal

3. **JSON Report** (`coverage/coverage-final.json`)
   - Machine-readable format
   - Useful for tooling and automation

4. **LCOV Report** (`coverage/lcov.info`)
   - Standard format for CI/CD integration
   - Compatible with most coverage tools and services

5. **Text Summary** (console output)
   - Brief coverage summary
   - Quick overview of coverage metrics

### Report Location

All coverage reports are generated in the `coverage/` directory at the project root.

## Running Coverage

### Basic Coverage
```bash
npm run test:cov
```
Runs all tests with coverage collection and generates all report formats.

### Watch Mode with Coverage
```bash
npm run test:cov:watch
```
Runs tests in watch mode with continuous coverage updates.

### CI/CD Coverage
```bash
npm run test:cov:ci
```
Optimized for CI environments with limited workers and CI-specific flags.

### Coverage with Threshold Enforcement
```bash
npm run test:cov:threshold
```
Explicitly enforces coverage thresholds (useful for validation).

### View HTML Report
```bash
npm run test:cov:html
```
Generates coverage and attempts to open the HTML report (macOS/Linux).

### All Tests with Coverage
```bash
npm run test:all:cov
```
Runs both unit tests and e2e tests with coverage.

## Coverage Best Practices

1. **Run coverage locally before committing**
   - Ensures your changes meet threshold requirements
   - Identifies untested code paths

2. **Review HTML reports**
   - Identify specific lines that need testing
   - Understand which branches are not covered

3. **Maintain or improve coverage**
   - New code should be fully tested
   - Don't reduce overall project coverage

4. **Focus on meaningful coverage**
   - 100% coverage doesn't guarantee quality
   - Focus on testing critical paths and edge cases

5. **Exclude appropriately**
   - DTOs and interfaces typically don't need coverage
   - Configuration files may not need testing
   - Focus coverage on business logic

## CI/CD Integration

Coverage is automatically collected and enforced in CI/CD pipelines:

1. Tests run with coverage enabled
2. Coverage thresholds are checked
3. Build fails if thresholds are not met
4. Coverage reports are uploaded to coverage services (if configured)

## Troubleshooting

### Build Fails Due to Coverage
If the build fails due to coverage thresholds:

1. Run `npm run test:cov:html` to view detailed report
2. Identify uncovered code sections
3. Add tests for critical uncovered paths
4. Consider if some files should be excluded (update `jest.config.ts`)

### Coverage Not Generated
If coverage reports are not generated:

1. Ensure you're using the `--coverage` flag or `test:cov` script
2. Check that `jest.config.ts` has correct coverage settings
3. Verify that `coverage/` directory is writable

### Incorrect Coverage Metrics
If coverage metrics seem incorrect:

1. Check `collectCoverageFrom` patterns in `jest.config.ts`
2. Verify exclusion patterns are correct
3. Clear coverage directory: `rm -rf coverage && npm run test:cov`

## Coverage Goals

While the current threshold is 80%, teams should strive for:
- **Critical business logic**: 90%+ coverage
- **Utility functions**: 85%+ coverage
- **Controllers and services**: 80%+ coverage
- **Error handlers and filters**: 90%+ coverage

## References

- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [Istanbul Coverage Formats](https://istanbul.js.org/docs/advanced/alternative-reporters/)
- [Best Practices for Code Coverage](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-testing-libraryuser-event)
