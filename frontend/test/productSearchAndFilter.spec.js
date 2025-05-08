import assert from "assert";
import { Builder, By, until } from "selenium-webdriver";

describe("Product Search and Filter", () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("should search for products", async () => {
    await driver.get("http://localhost:5173/collection");
    const searchIcon = await driver.findElement(By.id("search-icon"));
    await searchIcon.click();
    await driver.wait(until.elementLocated(By.name("search")), 5000);
    const searchBar = await driver.findElement(By.name("search"));

    await searchBar.sendKeys("shirt");
    await searchBar.sendKeys("\uE007");

    await driver.wait(until.elementLocated(By.css(".product-item")), 5000);
    const productItems = await driver.findElements(By.css(".product-item"));
    assert.strictEqual(productItems.length > 0, true);
    const firstProduct = productItems[0];
    const productName = await firstProduct.findElement(By.css(".product-name"));
    const productNameText = await productName.getText();
    assert.strictEqual(productNameText.toLowerCase().includes("shirt"), true);
  });

  after(async () => {
    await driver.quit();
  });
});
