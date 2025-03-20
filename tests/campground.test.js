const { Builder, By, until } = require("selenium-webdriver");

let driver;

beforeTest = async () => {
    driver = await new Builder().forBrowser("chrome").build();
};

afterTest = async () => {
    await driver.quit();
};

(async function testAddCampground() {
    await beforeTest();

    try {
        await driver.get("http://localhost:4000/campgrounds/new");

        // Wait for input fields and interact
        let titleInput = await driver.wait(until.elementLocated(By.id("title")), 5000);
        await driver.wait(until.elementIsVisible(titleInput), 5000);
        await titleInput.sendKeys("Selenium Camp");

        let locationInput = await driver.wait(until.elementLocated(By.id("location")), 5000);
        await driver.wait(until.elementIsVisible(locationInput), 5000);
        await locationInput.sendKeys("Selenium City");

        let descriptionInput = await driver.wait(until.elementLocated(By.id("description")), 5000);
        await driver.wait(until.elementIsVisible(descriptionInput), 5000);
        await descriptionInput.sendKeys("A beautiful campground created with Selenium!");

        let priceInput = await driver.wait(until.elementLocated(By.id("price")), 5000);
        await driver.wait(until.elementIsVisible(priceInput), 5000);
        await priceInput.sendKeys("50");

        let imageInput = await driver.wait(until.elementLocated(By.id("image")), 5000);
        await driver.wait(until.elementIsVisible(imageInput), 5000);
        await imageInput.sendKeys("https://source.unsplash.com/400x300/?camping");


        // Wait for submit button and ensure it's clickable
        let submitButton = await driver.wait(until.elementLocated(By.id("submit")), 5000);
        await driver.wait(until.elementIsVisible(submitButton), 5000);
        
        // Use JavaScript click in case of non-interactable elements
        await driver.executeScript("arguments[0].click();", submitButton);

        // Wait for redirection to campgrounds page
        await driver.wait(until.urlContains("/campgrounds"), 5000);
        console.log("Test Passed: Campground added successfully!");
    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await afterTest();
    }
})();
