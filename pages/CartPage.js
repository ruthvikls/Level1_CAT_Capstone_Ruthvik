class CartPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.shoppingCartHeading = page.getByText('Shopping Cart', { exact: true });
    this.cartRows = page.locator('.cart_info tbody tr');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.checkoutButton = page.locator('a.btn.btn-default.check_out');
  }

  getProductRow(productName) {
    return this.cartRows.filter({ hasText: productName });
  }

  getProductLink(productName) {
    return this.getProductRow(productName).getByRole('link', {
      name: productName,
      exact: true,
    });
  }

  getProductPrice(productName) {
    return this.getProductRow(productName).locator('.cart_price p');
  }

  getProductTotal(productName) {
    return this.getProductRow(productName).locator('.cart_total p');
  }

  getRemoveProductButton(productName) {
    return this.getProductRow(productName).locator('.cart_quantity_delete');
  }

  getRemoveProductButtonById(productId) {
    return this.page.locator(`.cart_quantity_delete[data-product-id="${productId}"]`);
  }

  async open() {
    await this.cartLink.click();
  }

  async removeProduct(productName) {
    await this.getRemoveProductButton(productName).click();
  }

  // async clearCart() {
  //   await this.open();
  //   while ((await this.deleteButtons.count()) > 0) {
  //     const firstDeleteButton = this.deleteButtons.first();
  //     const productId = await firstDeleteButton.getAttribute('data-product-id');

  //     if (!productId) {
  //       throw new Error('Cart delete button is missing its data-product-id.');
  //     }

  //     const deleteButton = this.getRemoveProductButtonById(productId);
  //     if ((await deleteButton.count()) === 0) {
  //       continue;
  //     }

  //     await deleteButton.click();
  //     await deleteButton.waitFor({ state: 'detached' });
  //   }
  // }

  async clearCart() {
  await this.open();

  while (true) {
    const rowCountBefore = await this.cartRows.count();
    if (rowCountBefore === 0) break;

    const firstDeleteButton = this.deleteButtons.first();
    await firstDeleteButton.click();

    await this.page.waitForFunction(
      previousCount =>
        document.querySelectorAll('.cart_info tbody tr').length < previousCount,
      rowCountBefore,
    );
  }
}

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = CartPage;
