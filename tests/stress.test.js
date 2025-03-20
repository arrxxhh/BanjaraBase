const { Builder, By, until } = require("selenium-webdriver");

async function registerUser(userIndex) {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:4000/register");

        let usernameInput = await driver.wait(until.elementLocated(By.id("username")), 5000);
        let usernameemail = await driver.wait(until.elementLocated(By.id("email")), 5000);
        let passwordInput = await driver.wait(until.elementLocated(By.id("password")), 5000);
        let submitButton = await driver.wait(until.elementLocated(By.id("btn")), 5000);

        await usernameInput.sendKeys(`testUser${userIndex}`);
        await usernameemail.sendKeys(`testUser${userIndex}@gmail.com`);
        await passwordInput.sendKeys("testPassword");
        await driver.executeScript("arguments[0].click();", submitButton);

        await driver.wait(until.urlContains("/campgrounds"), 15000);
        console.log(`Registered: testUser${userIndex}`);
    } catch (error) {
        console.error(`Registration failed for testUser${userIndex}:`, error.message);
    } finally {
        await driver.quit();
    }
}

async function loginUser(userIndex) {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:4000/login");

        let usernameInput = await driver.wait(until.elementLocated(By.id("username")), 5000);
        let passwordInput = await driver.wait(until.elementLocated(By.id("password")), 5000);
        let submitButton = await driver.wait(until.elementLocated(By.id("btn")), 5000);

        await usernameInput.sendKeys(`testUser${userIndex}`);
        await passwordInput.sendKeys("testPassword");
        await driver.executeScript("arguments[0].click();", submitButton);

        await driver.wait(until.urlContains("/campgrounds"), 5000);
        console.log(`Logged in: testUser${userIndex}`);
    } catch (error) {
        console.error(`Login failed for testUser${userIndex}:`, error.message);
    } finally {
        await driver.quit();
    }
}

async function runStressTest() {
    let userCount = 15;
    let registerPromises = [];

    console.log(" Starting Registration...");
    for (let i = 1; i <= userCount; i++) {
        registerPromises.push(registerUser(i));
    }
    await Promise.allSettled(registerPromises);
    console.log("Registration Completed\n");

    let loginPromises = [];
    console.log(" Starting Stress Test (Concurrent Logins)...");
    for (let i = 1; i <= userCount; i++) {
        loginPromises.push(loginUser(i));
    }
    await Promise.allSettled(loginPromises);
    console.log("Stress Test Completed");
}

runStressTest();
