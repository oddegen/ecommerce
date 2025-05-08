import assert from "assert";
import { Builder, By, until } from "selenium-webdriver";

describe("User Registration", () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should register a new user successfully", async () => {
    await driver.get("http://localhost:5173/login");

    const createAccountPTag = await driver.findElement(
      By.xpath("//p[contains(text(), 'Create account')]")
    );
    await createAccountPTag.click();
    await driver.wait(until.elementLocated(By.name("name")), 5000);

    const nameField = await driver.findElement(By.name("name"));
    const emailField = await driver.findElement(By.name("email"));
    const passwordField = await driver.findElement(By.name("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    await nameField.sendKeys("testuser");
    await emailField.sendKeys("testuser@example.com");
    await passwordField.sendKeys("Password123!");
    await submitButton.click();

    await driver.wait(until.urlIs("http://localhost:5173/"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, "http://localhost:5173/");
  });

  it("invalid email format", async () => {
    await driver.get("http://localhost:5173/login");

    const createAccountPTag = await driver.findElement(
      By.xpath("//p[contains(text(), 'Create account')]")
    );
    await createAccountPTag.click();
    await driver.wait(until.elementLocated(By.name("name")), 5000);

    const nameField = await driver.findElement(By.name("name"));
    const emailField = await driver.findElement(By.name("email"));
    const passwordField = await driver.findElement(By.name("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    await nameField.sendKeys("testuser");
    await emailField.sendKeys("invalid-email");
    await passwordField.sendKeys("Password123!");
    await submitButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".Toastify__toast--error")),
      5000
    );
    const errorText = await errorMessage.getText();
    assert.strictEqual(errorText, "Invalid email");
  });

  it("password too short", async () => {
    await driver.get("http://localhost:5173/login");

    const createAccountPTag = await driver.findElement(
      By.xpath("//p[contains(text(), 'Create account')]")
    );
    await createAccountPTag.click();
    await driver.wait(until.elementLocated(By.name("name")), 5000);

    const nameField = await driver.findElement(By.name("name"));
    const emailField = await driver.findElement(By.name("email"));
    const passwordField = await driver.findElement(By.name("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    await nameField.sendKeys("testuser");
    await emailField.sendKeys("testuser@example.com");
    await passwordField.sendKeys("short");
    await submitButton.click();
    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".Toastify__toast--error")),
      5000
    );
    const errorText = await errorMessage.getText();
    assert.strictEqual(errorText, "Password must be at least 8 characters");
  });

  after(async () => {
    await driver.quit();
  });
});
