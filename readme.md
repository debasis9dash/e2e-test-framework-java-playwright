# E2E Test Framework — Java REST Assured + TypeScript Playwright

A production-grade test automation framework demonstrating 
patterns including contract-first testing, parallel execution,
ThreadLocal isolation, Page Object Model, and CI/CD integration.

---

## Tech Stack

| Module | Language   | Framework | Purpose |
|---|------------|---|---|
| `e2e-api-tests` | Java 17    | REST Assured + TestNG | Contract + API functional tests |
| `e2e-ui-tests` | TypeScript | Playwright | UI end-to-end tests |

---

## Project Structure

```
restful-booker-e2etests/
├── e2e-api-tests/
│   ├── build.gradle
│   └── src/test/
│       ├── java/com/db/crypto/
│       │   ├── base/
│       │   │   └── BaseTest.java          ← ThreadLocal parallel setup
│       │   ├── models/
│       │   │   ├── BookingRequest.java
│       │   │   └── BookingDates.java
│       │   ├── tests/
│       │   │   ├── BookingTest.java        ← Functional parallel tests
│       │   │   └── contracts/
│       │   │       └── BookingContractTest.java  ← Schema validation only
│       │   └── utils/
│       │       ├── TestDataGenerator.java
│       │       └── SchemaValidator.java    ← Centralized schema validation
│       └── resources/
│           ├── config.properties.example
│           ├── testng.xml                  ← Full suite
│           ├── testng-contract.xml         ← Contract suite only
│           ├── testng-functional.xml       ← Functional suite only
│           └── schemas/
│               ├── auth-schema.json
│               ├── create-booking-schema.json
│               └── get-booking-schema.json
│
├── e2e-ui-tests/
│   ├── playwright.config.ts
│   ├── package.json
│   └── src/
│       ├── pages/
│       │   ├── BasePage.ts
│       │   └── BookingPage.ts             ← Page Object Model
│       ├── tests/
│       │   └── booking.spec.ts
│       ├── fixtures/
│       │   └── testFixtures.ts
│       └── utils/
│           └── TestDataGenerator.ts
│
├── Jenkinsfile
├── .github/workflows/
│   └── test-pipeline.yml
└── settings.gradle
```

---

## Test Strategy

```
Pipeline Execution Order:

  Contract Tests (fail-fast gate)
        ↓ passes
  ┌─────────────────┬──────────────────┐
  │ API Functional  │   UI Tests       │
  │ Tests           │   Playwright     │
  │ (parallel)      │   (parallel)     │
  └─────────┬───────┴──────┬───────────┘
            │  nightly only │
            └──────┬────────┘
                   ↓
          Performance Tests (k6)
```

| Layer | Class | Purpose | Runs |
|---|---|---|---|
| Contract | `BookingContractTest` | Schema validation only | First — fail fast |
| Functional | `BookingTest` | Business logic | After contracts pass |
| UI | `booking.spec.ts` | User journeys | Parallel with functional |
| Performance | `booking-journeys.js` | Load and stress | Nightly only |

---

## Key Engineering Patterns

- **ThreadLocal** — each parallel test thread owns its own test data
- **@BeforeMethod / @AfterMethod** — every test creates and cleans up independently
- **SchemaValidator** — centralized schema validation, single responsibility
- **Contract-first pipeline** — schema gate before functional tests
- **Page Object Model** — UI locators separated from test logic
- **Dynamic test data** — no hardcoded values, unique per thread and run

---

## Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Gradle (wrapper included)

### API Tests

```bash
# Copy config template
cp e2e-api-tests/src/test/resources/config.properties.example \
   e2e-api-tests/src/test/resources/config.properties

# Edit config.properties with your values

# Run full suite
./gradlew :e2e-api-tests:test

# Run contract tests only
./gradlew :e2e-api-tests:test -Dtest.suite=contract

# Run functional tests only
./gradlew :e2e-api-tests:test -Dtest.suite=functional
```

### UI Tests

```bash
cd e2e-ui-tests
npm install
npx playwright install chromium
npx playwright test

# Headed mode
npx playwright test --headed

# View report
npx playwright show-report
```

---

## CI/CD

### GitHub Actions
Triggers on every PR to `main` or `develop`, push to `main`, and nightly at 2 AM UTC.

### Jenkins
Triggers on every PR and nightly at 2 AM via cron.

### Secrets Required

| Secret | Description |
|---|---|
| `BASE_URL` | API base URL |
| `API_USERNAME` | Auth username |
| `API_PASSWORD` | Auth password |