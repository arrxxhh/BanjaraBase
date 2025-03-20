const { Builder, By, until } = require('selenium-webdriver');
const mongoose = require("mongoose");
const Campground = require("../models/campground");

const DB_URL = "mongodb://localhost:27017/yelpcamp_test";

async function connectDB() {
    await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await Campground.deleteMany({}); // Clean up test data before running tests
}

async function closeDB() {
    await mongoose.connection.close();
}

async function testSignup() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:4000/register');

        await driver.findElement(By.id('username')).sendKeys('testuser');
        await driver.findElement(By.id('email')).sendKeys('test@example.com');
        await driver.findElement(By.id('password')).sendKeys('testpassword');
        await driver.findElement(By.id('btn')).click();

        // Improved waiting condition (checks for element presence too)
        await driver.wait(until.elementLocated(By.id('camp')), 10000);
        console.log('Signup Test Passed');
    } catch (error) {
        console.error(`Signup Test Failed: ${error.message}`);
    } finally {
        await driver.quit();
    }
}

async function testLogin() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:4000/login');

        await driver.findElement(By.id('username')).sendKeys('testuser');
        await driver.findElement(By.id('password')).sendKeys('testpassword');
        await driver.findElement(By.id('btn')).click();

        // Improved waiting condition
        await driver.wait(until.elementLocated(By.id('camp')), 10000);
        console.log('Login Test Passed');
    } catch (error) {
        console.error(`Login Test Failed: ${error.message}`);
    } finally {
        await driver.quit();
    }
}

// Run tests sequentially
(async () => {
    await connectDB();
    await testSignup();
    await testLogin();
    await closeDB();
})();
