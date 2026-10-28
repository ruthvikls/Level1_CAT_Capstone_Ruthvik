class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutRows = page.locator('.cart_info tbody tr');
    this.addressDetailsHeading = page.getByText('Address Details', { exact: true });
    this.reviewOrderHeading = page.getByText('Review Your Order', { exact: true });
    this.orderCommentInput = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
    this.cardNameInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cardCvcInput = page.locator('[data-qa="cvc"]');
    this.cardExpiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.cardExpiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
    this.orderConfirmationMessage = page.getByText(
      'Congratulations! Your order has been confirmed!',
      { exact: true },
    );
     this.adCloseButton = page.getByText('Close', { exact: true });
  }

  getCheckoutRow(productName) {
    return this.checkoutRows.filter({ hasText: productName });
  }

  getProductLink(productName) {
    return this.getCheckoutRow(productName).getByRole('link', {
      name: productName,
      exact: true,
    });
  }

  getProductPrice(productName) {
    return this.getCheckoutRow(productName).locator('.cart_price p');
  }

  getProductTotal(productName) {
    return this.getCheckoutRow(productName).locator('.cart_total p');
  }

  async placeOrder(comment) {
    await this.orderCommentInput.fill(comment);
    await this.placeOrderLink.click();
  }

  async dismissAdIfPresent() {
    if (await this.adCloseButton.isVisible()) {
      await this.adCloseButton.click();
    }
  }
  async payAndConfirm(payment) {
    await this.dismissAdIfPresent();

    await this.cardNameInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cardCvcInput.fill(payment.cvc);
    await this.cardExpiryMonthInput.fill(payment.expiryMonth);
    await this.cardExpiryYearInput.fill(payment.expiryYear);
    await this.payAndConfirmButton.click();
  }

}

module.exports = CheckoutPage;
