import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

describe("Add to Cart and Cart Summary", () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should add an item to the cart and display it in summary", async () => {
    // log in before testing
    await driver.get("http://localhost:5173/login");
    await driver.findElement(By.name("email")).sendKeys("testuser@example.com");
    await driver.findElement(By.name("password")).sendKeys("Password123!");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:5173/"), 5000);

    // navigate to a product detail page
    await driver.get("http://localhost:5173/product/1");
    await driver.findElement(By.css("button.add-to-cart")).click();
    await driver.get("http://localhost:5173/cart");

    const itemName = await driver
      .findElement(By.css(".cart-item .name"))
      .getText();
    const itemPrice = await driver
      .findElement(By.css(".cart-item .price"))
      .getText();
    const quantity = await driver
      .findElement(By.css(".cart-item .quantity"))
      .getAttribute("value");

    assert.strictEqual(itemName, "Sample Product");
    assert.match(itemPrice, /^\$\d+\.\d{2}$/);
    assert.strictEqual(quantity, "1");
  });

  it("should increment quantity when adding the same item twice", async () => {
    await driver.get("http://localhost:5173/product/1");
    await driver.findElement(By.css("button.add-to-cart")).click();
    await driver.get("http://localhost:5173/cart");

    const updatedQty = await driver
      .findElement(By.css(".cart-item .quantity"))
      .getAttribute("value");
    assert.strictEqual(updatedQty, "2");
  });

  after(async () => {
    // remove token from local storage
    await driver.executeScript("localStorage.removeItem('token');");
    await driver.quit();
  });
});
