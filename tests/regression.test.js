const { Builder, By, until } = require("selenium-webdriver");

let driver;

async function beforeTest() {
    driver = await new Builder().forBrowser("chrome").build();
}

async function afterTest() {
    await driver.quit();
}

(async function regressionLoginTest() {
    await beforeTest();

    try {
        console.log("Testing Valid Login...");
        await driver.get("http://localhost:4000/login");

        let usernameInput = await driver.findElement(By.id("username"));
        let passwordInput = await driver.findElement(By.id("password"));
        let submitButton = await driver.findElement(By.id("btn"));

        await usernameInput.sendKeys("testuser");
        await passwordInput.sendKeys("testpassword");
        await submitButton.click();

       // await driver.wait(until.urlContains("/campgrounds"), 5000);

        let dashboardText = await driver.findElement(By.id("h1")).getText();
        if (dashboardText.includes("Campgrounds")) {
            console.log("Valid Login Test Passed");
        } else {
            console.error("Valid Login Test Failed");
        }

        console.log("Testing Invalid Login...");
        await driver.get("http://localhost:4000/login");

        usernameInput = await driver.findElement(By.id("username"));
        passwordInput = await driver.findElement(By.id("password"));
        submitButton = await driver.findElement(By.id("btn"));

        await usernameInput.sendKeys("testuser");
        await passwordInput.sendKeys("wrongPassword");
        await submitButton.click();

        let dashboardText1 = await driver.findElement(By.id("h1")).getText();
        if (!dashboardText1.includes("Campgrounds")) {
            console.log("Invalid Login Test Passed");
        } else {
            console.error("Invalid Login Test Failed");
        }

        console.log("Testing Empty Fields...");
        await driver.get("http://localhost:4000/login");
        submitButton = await driver.findElement(By.id("btn"));

        await submitButton.click();

        let dashboardText11 = await driver.findElement(By.id("h1")).getText();
        if (!dashboardText11.includes("Campgrounds")) {
            console.log("Invalid Login Test Passed");
        } else {
            console.error("Invalid Login Test Failed");
        }


    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await afterTest();
    }
})();
