import assert from "assert";
import { Builder, By, until } from "selenium-webdriver";

describe("User Login", () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    await driver.executeScript("localStorage.removeItem('token');");
  });

  it("should log in an existing user successfully", async () => {
    await driver.get("http://localhost:5173/login");

    const emailField = await driver.findElement(By.name("email"));
    const passwordField = await driver.findElement(By.name("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    await emailField.sendKeys("testuser@example.com");
    await passwordField.sendKeys("Password123!");
    await submitButton.click();

    await driver.wait(until.urlIs("http://localhost:5173/"), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), "http://localhost:5173/");
  });

  it("should show an error message for invalid credentials", async () => {
    await driver.get("http://localhost:5173/login");
    const emailField = await driver.findElement(By.name("email"));
    const passwordField = await driver.findElement(By.name("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await emailField.sendKeys("wrong@email.com");
    await passwordField.sendKeys("wrongpassword");
    await submitButton.click();
    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".Toastify__toast--error")),
      5000
    );
    const errorText = await errorMessage.getText();
    assert.strictEqual(errorText, "User not found");
  });

  after(async () => {
    await driver.quit();
  });
});
