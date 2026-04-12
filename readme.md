# E2E Test Framework — Java REST Assured + TypeScript Playwright

End-to-end test framework for the Restful Booker API.

## Modules

| Module | Stack | Purpose |
|---|---|---|
| `e2e-api-tests` | Java + REST Assured + TestNG | API integration tests |
| `e2e-ui-tests` | TypeScript + Playwright | UI end-to-end tests |

## Setup

### API Tests
```bash
# Copy config template
cp e2e-api-tests/src/test/resources/config.properties.example \
   e2e-api-tests/src/test/resources/config.properties

# Edit config.properties with your credentials
# Run tests
./gradlew :e2e-api-tests:test
```

### UI Tests
```bash
cd e2e-ui-tests
npm install
npx playwright install chromium
npx playwright test
```

## CI/CD
- Jenkins: see `Jenkinsfile`
- GitHub Actions: see `.github/workflows/test-pipeline.yml`

## Structure 
restful-booker-e2e-tests/
├── e2e-api-tests/                    ← Java module
│   ├── build.gradle
│   └── src/
│       └── test/
│           └── java/
│               └── com/deutschebank/
│                   ├── base/
│                   │   └── BaseTest.java
│                   ├── models/
│                   │   ├── BookingRequest.java
│                   │   └── BookingDates.java
│                   ├── tests/
│                   │   └── BookingTest.java
│                   └── utils/
│                       └── TestDataGenerator.java
│           └── resources/
│               ├── config.properties
│               └── testng.xml
│
├── e2e-ui-tests/                     ← TypeScript module
│   ├── package.json                  ← replaces build.gradle
│   ├── tsconfig.json
│   ├── playwright.config.ts
│   └── src/
│       ├── pages/
│       │   ├── BasePage.ts
│       │   └── BookingPage.ts
│       ├── tests/
│       │   └── booking.spec.ts
│       ├── fixtures/
│       │   └── testFixtures.ts
│       └── utils/
│           └── TestDataGenerator.ts
│
├── .gitignore
├── gradlew
├── gradlew.bat
├── settings.gradle                   ← only includes e2e-api-tests
├── build.gradle                      ← root build
└── readme.md
