import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

describe("Navigation Menu Links", () => {
  let driver;
  const baseUrl = "http://localhost:5173";

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should navigate to Home page", async () => {
    await driver.get(baseUrl);
    await driver.findElement(By.css('a[href="/"]')).click();
    await driver.wait(until.urlIs(`${baseUrl}/`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/`);
  });

  it("should navigate to Collection page", async () => {
    await driver.findElement(By.css('a[href="/collection"]')).click();
    await driver.wait(until.urlIs(`${baseUrl}/collection`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/collection`);
  });

  it("should navigate to About page", async () => {
    await driver.findElement(By.css('a[href="/about"]')).click();
    await driver.wait(until.urlIs(`${baseUrl}/about`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/about`);
  });

  it("should navigate to Contact page", async () => {
    await driver.findElement(By.css('a[href="/contact"]')).click();
    await driver.wait(until.urlIs(`${baseUrl}/contact`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/contact`);
  });

  it("should navigate to Cart page via cart icon", async () => {
    // click cart link
    await driver.findElement(By.css('a[href="/cart"]')).click();
    await driver.wait(until.urlIs(`${baseUrl}/cart`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/cart`);
  });

  it("should navigate to Orders page after login", async () => {
    // perform login
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.name("email")).sendKeys("testuser@example.com");
    await driver.findElement(By.name("password")).sendKeys("Password123!");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs(`${baseUrl}/`), 5000);
    // open profile dropdown
    await driver.findElement(By.css('img[alt="profile"]')).click();
    // click Orders
    await driver.findElement(By.xpath("//p[text()='Orders']")).click();
    await driver.wait(until.urlIs(`${baseUrl}/orders`), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/orders`);
  });

  after(async () => {
    // remove token from local storage
    await driver.executeScript("localStorage.removeItem('token');");
    await driver.quit();
  });
});
