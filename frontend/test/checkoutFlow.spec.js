import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

describe("Checkout Flow", () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should complete the checkout process and display confirmation", async () => {
    await driver.get("http://localhost:5173/login");
    await driver.findElement(By.name("email")).sendKeys("testuser@example.com");
    await driver.findElement(By.name("password")).sendKeys("Password123!");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:5173/"), 5000);
    // add item to cart
    await driver.get("http://localhost:5173/product/1");
    await driver.findElement(By.css("button.add-to-cart")).click();
    // go to cart
    await driver.get("http://localhost:5173/cart");
    // start checkout
    await driver.findElement(By.css("button.checkout")).click();
    await driver.wait(until.urlContains("/place-order"), 500);

    assert.strictEqual(
      await driver.getCurrentUrl(),
      "http://localhost:5173/place-order"
    );
  });

  after(async () => {
    // remove token from local storage
    await driver.executeScript("localStorage.removeItem('token');");
    await driver.quit();
  });
});
