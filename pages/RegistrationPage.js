class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.signupForm = page.locator('form').filter({
      has: page.getByRole('button', { name: 'Signup' }),
    });
    this.signupHeading = page.getByText('New User Signup!');
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = this.signupForm.getByPlaceholder('Email Address');
    this.signupButton = this.signupForm.getByRole('button', { name: 'Signup' });
    this.accountInformationHeading = page.getByText('Enter Account Information');
    this.accountCreatedMessage = page.getByText('Account Created!', { exact: true });
    this.mrTitleRadio = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');
    this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
    this.addressInput = page.getByRole('textbox', { name: 'Address * (Street address, P.' });
    this.stateInput = page.getByRole('textbox', { name: 'State *' });
    this.cityInput = page.locator('#city');
    this.zipCodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.getByRole('textbox', { name: 'Mobile Number *' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.continueLink = page.getByRole('link', { name: 'Continue' });
  }

  getTitleRadio(title) {
    return this.page.getByRole('radio', { name: title });
  }

  async startSignup(name, email) {
    await this.nameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async completeAccountDetails(details) {
    await this.getTitleRadio(details.title).check();
    await this.passwordInput.fill(details.password);
    await this.birthDaySelect.selectOption(details.birthDay);
    await this.birthMonthSelect.selectOption(details.birthMonth);
    await this.birthYearSelect.selectOption(details.birthYear);
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipCodeInput.fill(details.zipCode);
    await this.mobileNumberInput.fill(details.mobileNumber);
    await this.createAccountButton.click();
  }

  async continueAfterCreation() {
    await this.continueLink.click();
  }
}

module.exports = RegistrationPage;
