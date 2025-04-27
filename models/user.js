const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const passportlm = require('passport-local-mongoose');

const Userschema= new Schema({
   // username: { type: String, required: [true, "Username is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
   // password: { type: String, required: [true, "Password is required"] }
});
 
Userschema.plugin(passportlm);

module.exports = mongoose.model('Users',Userschema);
