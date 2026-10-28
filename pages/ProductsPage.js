class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: ' Products' });
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productTitles = page.locator('.features_items .productinfo p');
    this.productCards = page.locator('.features_items .productinfo');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  getProductCard(productName) {
    return this.productCards.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  getProductPrice(productName) {
    return this.getProductCard(productName).locator('h2');
  }

  getAddToCartAction(productName) {
    return this.getProductCard(productName).getByText('Add to cart', { exact: true });
  }

  async open() {
    await this.productsLink.click();
  }

  async search(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  async addNamedProduct(productName) {
    const price = (await this.getProductPrice(productName).innerText()).trim();
    await this.getAddToCartAction(productName).click();
    await this.continueShoppingButton.click();
    return price;
  }
}

module.exports = ProductsPage;
