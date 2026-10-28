class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginForm = page.locator('form[action="/login"]');
    this.signupLoginLink = page.getByRole('link', { name: /Signup \/ Login/ });
    this.loginEmailInput = this.loginForm.getByRole('textbox', { name: 'Email Address' });
    this.loginPasswordInput = this.loginForm.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.loginForm.getByRole('button', { name: 'Login' });
    this.loggedInUser = page.locator('a').filter({ hasText: 'Logged in as' });
    this.loginHeading = page.getByText('Login to your account');
    this.logoutLink = page.getByRole('link', { name: /Logout/ });
    this.invalidLoginMessage = page.getByText('Your email or password is incorrect!', {
      exact: true,
    });
  }

  async open(baseUrl) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.signupLoginLink.click();
  }

  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = LoginPage;
