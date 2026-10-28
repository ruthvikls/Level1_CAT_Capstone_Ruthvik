# Automation Exercise - Playwright Tests

This project contains browser tests for [Automation Exercise](https://automationexercise.com/), written in JavaScript with Playwright Test.

The tests cover login, registration, product search, cart operations, checkout, and the Contact Us form. The project uses the Page Object Model (POM) to keep page locators and actions separate from test scenarios.

## Framework structure

```text
project-root/
├── fixtures/
│   └── baseTest.js
├── pages/
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── ContactUsPage.js
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   └── RegistrationPage.js
├── playwright/
│   └── .auth/
│       └── user.json             # Generated login state; do not commit
├── testData/
│   └── test-data.json
├── tests/
│   ├── auth.setup.js
│   └── tests_e2e.spec.js
├── utils/
│   └── helpers.js
├── playwright.config.js
├── package.json
└── README.md
```

Playwright also generates `playwright-report/` and `test-results/` when tests run. These are output folders, not source code.

## How the framework is organized

### Page objects: `pages/`

Each page class represents a website page. It contains that page’s locators and actions. For example, `CartPage` contains cart-related locators and methods such as opening the cart and removing products.

Page objects keep test steps readable and avoid repeating locator details in tests. Tests should contain scenario steps and assertions; page objects should contain page-specific actions and locators.

### Fixtures: `fixtures/baseTest.js`

The custom Playwright fixture creates the page objects and provides them to tests. A test can request the objects it needs by destructuring them from its fixture argument:

```js
test('example', async ({ productsPage, cartPage }) => {
  // Use the provided page objects here
});
```

This avoids constructing page classes separately in every test.

### Test scenarios: `tests/`

`tests/tests_e2e.spec.js` contains the test scenarios and their assertions.

The current scenarios include:

- Successful login and logout
- Invalid login
- New user registration
- Adding and removing a product from the cart
- Product search
- Adding a product and placing an order
- Contact form validation and submission

Some scenarios that need an authenticated user are grouped under **“Tests requiring login using Storage State.”**

### Authentication setup and storage state

`tests/auth.setup.js` logs in once and saves the browser session to:

```text
playwright/.auth/user.json
```

The browser projects in `playwright.config.js` depend on the setup project. Tests that need the saved session opt into it with `test.use({ storageState: authFile })`.

This lets those tests start already signed in instead of repeating the login steps. Tests that check login, invalid credentials, or registration should not use this saved state because they need to test their own logged-out flow.

The saved state contains session information. It is ignored by Git and should never be committed or shared.

### Test data: `testData/test-data.json`

This JSON file holds data used by test scenarios, such as product names, form values, and expected messages. Keeping values separate from test steps makes it easier to maintain or change test inputs.

Do not commit real passwords or other sensitive values. If the file contains real account credentials, move them to environment variables or another local, untracked source before sharing the project.

### Shared helpers: `utils/helpers.js`

This file contains reusable helper logic used by tests, such as generating unique registration emails and accepting a browser dialog during a form submission.

It is not necessary to wrap basic Playwright operations such as `click()` or `fill()` in utility functions. Page-specific form actions belong in their page objects.

### Playwright configuration: `playwright.config.js`

The configuration defines:

- `tests/` as the test directory
- Chromium, Firefox, WebKit, and mobile Chrome projects
- A 30-second test timeout
- HTML reporting
- Screenshots and traces for failed tests
- A setup project that creates the authenticated storage state

## Installation

From the project root, install the Node.js dependencies:

```powershell
npm install
```

Install the Playwright browser binaries:

```powershell
npx playwright install
```

## Running tests

Run the full suite across the configured projects:

```powershell
npx playwright test
```

Run the suite in Chromium only:

```powershell
npx playwright test --project=chromium
```

Run one test by its title:

```powershell
npx playwright test --grep "Contact us form validation" --project=chromium
```

Run the three tests in the authenticated group:

```powershell
npx playwright test --grep "Tests requiring login using Storage State" --project=chromium
```

The setup project should run automatically before a project that depends on it.

Repeat a test six times, sequentially, to check for intermittent behavior:

```powershell
npx playwright test --grep "Contact us form validation" --project=chromium --repeat-each=6 --workers=1
```

## HTML report

The project uses Playwright’s HTML reporter. After a test run, open the report with:

```powershell
npx playwright show-report
```

The report is generated in `playwright-report/`. To create a ZIP of it in PowerShell:

```powershell
Compress-Archive -Path .\playwright-report -DestinationPath .\playwright-report.zip -Force
```

## Troubleshooting

### Authenticated tests appear logged out

The saved state may be missing, expired, or invalid. Run the authentication setup by running a test project that depends on it. If needed, remove the local `playwright/.auth/user.json` file and rerun the tests so the setup can create a fresh one.

### A dialog-related test fails

A browser dialog can prevent the page from progressing until it is accepted. The contact-form helper registers a dialog handler before submitting the form. The empty form is a separate case: browser-native required-field validation blocks the submission before a site dialog is shown.

### Cart tests fail intermittently

Cart operations change shared server-side account state. Run cart-related tests sequentially when diagnosing failures. Avoid running multiple tests that modify the same account’s cart at the same time.

### Test fails in one browser only

First rerun the specific test in that browser. Browser differences, network behavior, or website changes can affect a UI test. Check the Playwright report, screenshot, and trace to see which action or assertion failed.

## Notes

- The tests use a live external website, so network availability and website changes can affect results.
- Browser tests can modify account state, including cart contents and registration data.
- The registration test generates a unique email address to avoid reusing the same address each run.
- Run only against accounts and data you are authorized to use.