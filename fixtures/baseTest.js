const { test: baseTest, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const RegistrationPage = require('../pages/RegistrationPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const ContactUsPage = require('../pages/ContactUsPage');

const test = baseTest.extend({
  pageObjects: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      registrationPage: new RegistrationPage(page),
      productsPage: new ProductsPage(page),
      cartPage: new CartPage(page),
      checkoutPage: new CheckoutPage(page),
      contactUsPage: new ContactUsPage(page),
    });
  },
  loginPage: async ({ pageObjects }, use) => {
    await use(pageObjects.loginPage);
  },
  registrationPage: async ({ pageObjects }, use) => {
    await use(pageObjects.registrationPage);
  },
  productsPage: async ({ pageObjects }, use) => {
    await use(pageObjects.productsPage);
  },
  cartPage: async ({ pageObjects }, use) => {
    await use(pageObjects.cartPage);
  },
  checkoutPage: async ({ pageObjects }, use) => {
    await use(pageObjects.checkoutPage);
  },
  contactUsPage: async ({ pageObjects }, use) => {
    await use(pageObjects.contactUsPage);
  },
});

module.exports = { test, expect };
