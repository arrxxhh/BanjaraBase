const mongoose = require("mongoose");
const assert = require("assert");
const User = require("../models/user");

async function setup() {
    await mongoose.connect("mongodb://localhost:27017/yelpcamp_test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await User.deleteMany({}); 
    console.log("Database setup complete");
}

async function testCreateUser() {
    const userData = { username: "testuser", email: "test@example.com", password: "testpassword" };
    const user = new User(userData);
    
    const savedUser = await user.save();
    assert(savedUser._id, "User ID was not generated");
    assert.strictEqual(savedUser.username, userData.username, "Username mismatch");
    assert.strictEqual(savedUser.email, userData.email, "Email mismatch");

    console.log("User creation test passed");
}

async function testValidationError() {
    const user = new User({}); // Missing required fields
    
    try {
        await user.save();
    } catch (error) {
        assert(error.errors.email, " Email validation did not trigger");
        console.log("Validation error test passed");
        return;
    }
    console.log("Validation test failed (user saved without required fields)");
}


async function cleanup() {
    await mongoose.connection.close();
    console.log("Database connection closed");
}


(async function runTests() {
    await setup();
    await testCreateUser();
    await testValidationError();
    await cleanup();
})();
