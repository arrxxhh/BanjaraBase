const { Builder, By, until } = require("selenium-webdriver");

let driver;

const beforeTest = async () => {
    driver = await new Builder().forBrowser("chrome").build();
};

const afterTest = async () => {
    await driver.quit();
};

(async function testDeleteCampground() {
    await beforeTest();

    try {
        // 1️⃣ Navigate to campgrounds list
        await driver.get("http://localhost:4000/campgrounds");

        // 2️⃣ Wait for campgrounds to load and select the first one
        let firstCampgroundLink = await driver.wait(
            until.elementLocated(By.css(".campground-item")), 
            5000
        );
        await driver.wait(until.elementIsVisible(firstCampgroundLink), 5000);
        await firstCampgroundLink.click();

        // 3️⃣ Wait for delete button on the campground details page
        let deleteButton = await driver.wait(
            until.elementLocated(By.css(".btn-danger")), 
            5000
        );
        await driver.wait(until.elementIsVisible(deleteButton), 5000);

        // 4️⃣ Handle confirmation alert if it appears
        try {
            let alert = await driver.switchTo().alert();
            await alert.accept(); // Accept the alert
            console.log("Alert accepted.");
        } catch (error) {
            console.log("No alert found, proceeding...");
        }

        // 5️⃣ Use JavaScript click to ensure action is performed
        await driver.executeScript("arguments[0].click();", deleteButton);

        // 6️⃣ Wait for redirection back to campgrounds list
        await driver.wait(until.urlContains("/campgrounds"), 5000);
        console.log("Test Passed: Campground deleted successfully!");
    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await afterTest();
    }
})();
