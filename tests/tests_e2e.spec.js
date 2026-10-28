const { test, expect } = require('../fixtures/baseTest');
const data = require('../testData/test-data.json');
const {generateUniqueEmail,submitAndAcceptDialog,} = require('../utils/helpers');
const authFile = require('node:path').resolve(__dirname,'../playwright/.auth/user.json',);
test.beforeEach(async ({ page, context }) => {
  // Block common Google ad and tracking domains
  await context.route('**/*googlesyndication*/**', (route) => route.abort());
  await context.route('**/*googleads*/**', (route) => route.abort());
  await context.route('**/*doubleclick*/**', (route) => route.abort());
  await context.route('**/*adnxs*/**', (route) => route.abort());
});

test('User can log in and log out using valid credentials', async ({ loginPage }) => {
  await loginPage.open(data.baseUrl);
  await expect(loginPage.loginHeading).toBeVisible();

  await loginPage.login(data.users.valid.email, data.users.valid.password);
  await expect(loginPage.loggedInUser).toContainText(data.users.valid.username);
  await expect(loginPage.logoutLink).toBeVisible();

  await loginPage.logout();
  await expect(loginPage.loginHeading).toBeVisible();
  await expect(loginPage.logoutLink).toHaveCount(0);
});

test('shows an error when login credentials are incorrect', async ({ loginPage }) => {
  await loginPage.open(data.baseUrl);
  await expect(loginPage.loginHeading).toBeVisible();

  await loginPage.login(data.users.invalid.email, data.users.invalid.password);
  await expect(loginPage.invalidLoginMessage).toHaveText(data.messages.invalidLogin);
});

test('Register new user successfully', async ({ loginPage, registrationPage }) => {
 const registrationEmail = generateUniqueEmail(
  data.registration.emailPrefix,
  data.registration.emailDomain,
);
  await loginPage.open(data.baseUrl);
  await expect(registrationPage.signupHeading).toBeVisible();
  await registrationPage.startSignup(data.registration.name, registrationEmail);
  await expect(registrationPage.accountInformationHeading).toBeVisible();

  await registrationPage.completeAccountDetails(data.registration.account);
  await expect(registrationPage.accountCreatedMessage).toHaveText(data.messages.accountCreated);
  await registrationPage.continueAfterCreation();
  await expect(loginPage.loggedInUser).toContainText(data.registration.name);
});

test('Add Or Remove Products from Cart', async ({ loginPage, productsPage, cartPage }) => {
  await loginPage.open(data.baseUrl);
  await loginPage.login(data.users.cartTest.email, data.users.cartTest.password);
  await expect(loginPage.loggedInUser).toContainText(data.users.cartTest.username);

  await cartPage.clearCart();
  await expect(cartPage.emptyCartMessage).toBeVisible();

  await productsPage.open();
  await expect(productsPage.allProductsHeading).toBeVisible();
  await productsPage.search(data.products.category);
  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await expect(productsPage.getProductCard(data.products.name)).toHaveCount(1);
  await productsPage.addNamedProduct(data.products.name);

  await cartPage.open();
  await expect(cartPage.shoppingCartHeading).toBeVisible();
  await expect(cartPage.getProductRow(data.products.name)).toHaveCount(1);
  await expect(cartPage.getProductLink(data.products.name)).toBeVisible();
  await cartPage.removeProduct(data.products.name);
  await expect(cartPage.emptyCartMessage).toBeVisible();
});

test.describe('Tests requiring login using Storage State', () => {
  test.use({ storageState: authFile });
  test.beforeEach(async ({ page }) => {
    await page.goto(data.baseUrl);
  });

  // Put the three authenticated tests in this block.
  
test('Product search returns relevant results', async ({ loginPage, productsPage }) => {
  // await loginPage.open(data.baseUrl);
  // await loginPage.login(data.users.valid.email, data.users.valid.password);
  await expect(loginPage.loggedInUser).toContainText(data.users.valid.username);

  await productsPage.open();
  await expect(productsPage.allProductsHeading).toBeVisible();
  await productsPage.search(data.products.searchTerm);
  await expect(productsPage.searchedProductsHeading).toBeVisible();

  const resultCount = await productsPage.productTitles.count();
  expect(resultCount).toBeGreaterThan(0);
  for (let index = 0; index < resultCount; index += 1) {
    const title = await productsPage.productTitles.nth(index).innerText();
    expect(title.toLowerCase()).toContain(data.products.searchTerm.toLowerCase());
  }
});


test('Add Products to Cart and Place Order', async ({
  loginPage,
  productsPage,
  cartPage,
  checkoutPage,
}) => {
  // await loginPage.open(data.baseUrl);
  // await loginPage.login(data.users.valid.email, data.users.valid.password);
  await expect(loginPage.loggedInUser).toContainText(data.users.valid.username);

  await cartPage.clearCart();
  await expect(cartPage.emptyCartMessage).toBeVisible();

  await productsPage.open();
  await expect(productsPage.allProductsHeading).toBeVisible();
  await productsPage.search(data.products.category);
  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await expect(productsPage.getProductCard(data.products.name)).toHaveCount(1);

  const productPrice = await productsPage.addNamedProduct(data.products.name);
  expect(productPrice).toMatch(/^Rs\.\s*\d+$/);

  await cartPage.open();
  await expect(cartPage.shoppingCartHeading).toBeVisible();
  await expect(cartPage.getProductRow(data.products.name)).toHaveCount(1);
  await expect(cartPage.getProductLink(data.products.name)).toBeVisible();
  await expect(cartPage.getProductPrice(data.products.name)).toHaveText(productPrice);
  await expect(cartPage.getProductTotal(data.products.name)).toHaveText(productPrice);
  await cartPage.proceedToCheckout();

  await expect(checkoutPage.addressDetailsHeading).toBeVisible();
  await expect(checkoutPage.reviewOrderHeading).toBeVisible();
  await expect(checkoutPage.getCheckoutRow(data.products.name)).toHaveCount(1);
  await expect(checkoutPage.getProductLink(data.products.name)).toBeVisible();
  await expect(checkoutPage.getProductPrice(data.products.name)).toHaveText(productPrice);
  await expect(checkoutPage.getProductTotal(data.products.name)).toHaveText(productPrice);

  await checkoutPage.placeOrder(data.checkout.comment);
  await checkoutPage.payAndConfirm(data.checkout.payment);
  await expect(checkoutPage.orderConfirmationMessage).toHaveText(
    data.checkout.confirmationMessage,
  );
});

test('Contact us form validation', async ({ page, loginPage, contactUsPage }) => {
  // await loginPage.open(data.baseUrl);
  // await loginPage.login(data.users.valid.email, data.users.valid.password);
  await expect(loginPage.loggedInUser).toContainText(data.users.valid.username);

  await contactUsPage.open();
  await expect(contactUsPage.getInTouchHeading).toBeVisible();
  await contactUsPage.submitEmpty();
  const emptyFormIsValid = await contactUsPage.form.evaluate((form) =>
    form.checkValidity(),
  );
  expect(emptyFormIsValid).toBe(false);
  await expect(contactUsPage.successMessage).not.toBeVisible();
    
  const dialogMessage = await submitAndAcceptDialog(
    page,() => contactUsPage.submitForm(data.contact),);

await expect(contactUsPage.successMessage).toHaveText(data.contact.successMessage,);
});


});

