# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. Test Suite (`test.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **test**: Runs unit and E2E tests on multiple Node.js versions (18.x, 20.x)
  - Lints code
  - Runs unit tests with coverage
  - Runs E2E tests
  - Checks coverage threshold
  - Uploads coverage to Codecov
  - Comments PR with coverage report

- **build**: Builds the application after tests pass
  - Creates production build
  - Verifies build integrity
  - Uploads build artifacts

- **quality-gate**: Final quality checks
  - Runs full test suite
  - Enforces coverage threshold
  - Performs security audit
  - Checks dependencies

**Features:**
- Matrix testing across Node.js 18.x and 20.x
- Test result caching for faster builds
- Coverage reporting to Codecov
- PR comments with coverage details
- Artifact retention for 30 days

### 2. Coverage Report (`coverage.yml`)

Runs on:
- Push to `main` branch
- Pull requests to `main` branch
- Daily schedule (2 AM UTC)

**Jobs:**
- **coverage**: Generates comprehensive coverage reports
  - Runs all tests (unit + E2E) with coverage
  - Generates coverage badges
  - Uploads to Codecov and Coveralls
  - Archives coverage reports (90 days retention)
  - Posts detailed coverage comment on PRs

- **coverage-threshold**: Enforces minimum coverage requirements
  - Checks 80% threshold for branches, functions, lines, statements
  - Fails build if threshold not met

**Features:**
- Dual coverage reporting (Codecov + Coveralls)
- Coverage badge generation
- Daily coverage tracking
- 90-day coverage history
- Strict threshold enforcement

## Configuration Requirements

### Required Secrets

Add these secrets in your GitHub repository settings:

1. **CODECOV_TOKEN**: Token from codecov.io for uploading coverage reports
   - Get from: https://codecov.io/gh/OWNER/REPO/settings

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions
   - Used for PR comments and artifact uploads

### Optional Secrets

1. **COVERALLS_REPO_TOKEN**: For Coveralls integration (if using)

## Local Testing

Run the same commands locally before pushing:

```bash
# Run all CI tests
npm run test:ci

# Check coverage threshold
npm run test:cov:threshold

# Run full test suite with coverage
npm run test:all:cov
```

## Coverage Thresholds

Current thresholds (configured in `jest.config.ts`):
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Workflow Optimization

The workflows use several optimization techniques:

1. **Caching**: npm dependencies are cached using `actions/setup-node@v4`
2. **Parallel Execution**: Matrix strategy tests multiple Node versions simultaneously
3. **Conditional Steps**: Coverage uploads only run on Node 20.x to avoid duplicates
4. **Artifact Management**: Build artifacts retained for 7 days, coverage for 90 days
5. **CI-Optimized Tests**: Uses `--ci --maxWorkers=2` for better CI performance

## Quality Gates

The pipeline enforces these quality gates:

1. ✅ All tests must pass (unit + E2E)
2. ✅ Linting must pass with no errors
3. ✅ Code coverage must meet 80% threshold
4. ✅ Build must complete successfully
5. ⚠️  Security audit (warning only)
6. ⚠️  Dependency checks (warning only)

## Branch Protection

Recommended branch protection rules for `main`:

1. Require status checks to pass:
   - `test / Run Tests`
   - `build / Build Application`
   - `quality-gate / Quality Gate`
   - `coverage-threshold / Enforce Coverage Threshold`

2. Require branches to be up to date
3. Require pull request reviews (1+ approver)
4. Dismiss stale reviews on new commits
5. Require linear history

## Troubleshooting

### Tests fail in CI but pass locally
- Check Node.js version matches CI (18.x or 20.x)
- Run `npm ci` instead of `npm install`
- Run tests with CI flags: `npm run test:ci`

### Coverage upload fails
- Verify CODECOV_TOKEN is set correctly
- Check Codecov dashboard for project setup
- Review workflow logs for specific error messages

### Build artifacts missing
- Ensure `build:prod` script completes successfully
- Check artifact retention period (7 days)
- Verify upload-artifact action version compatibility

## Support

For workflow issues:
1. Check workflow run logs in GitHub Actions tab
2. Review jest.config.ts for test configuration
3. Verify all required secrets are configured
4. Check Node.js and npm versions in package.json engines
