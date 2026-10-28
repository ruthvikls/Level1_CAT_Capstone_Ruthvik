class ContactUsPage {
  constructor(page) {
    this.page = page;
    this.contactUsLink = page.getByRole('link', { name: /Contact us/i });
    this.form = page.locator('form').filter({
      has: page.locator('[data-qa="submit-button"]'),
    });
    this.submitButton = this.form.locator('[data-qa="submit-button"]');
    this.contactPage = page.locator('#contact-page');
    this.getInTouchHeading = page.getByText('Get In Touch', { exact: true });
    this.nameInput = this.form.locator('[data-qa="name"]');
    this.emailInput = this.form.locator('[data-qa="email"]');
    this.subjectInput = this.form.locator('[data-qa="subject"]');
    this.messageInput = this.form.locator('[data-qa="message"]');
    this.successMessage = this.contactPage.getByText(
      'Success! Your details have been submitted successfully.',
      { exact: true },
    );
  }

  async open() {
    await this.contactUsLink.click();
  }

  async submitEmpty() {
    await this.submitButton.click();
  }

  async submitForm(details) {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.subjectInput.fill(details.subject);
    await this.messageInput.fill(details.message);
    await this.submitButton.click();
  }
}

module.exports = ContactUsPage;
