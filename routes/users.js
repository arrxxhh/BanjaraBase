const express= require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { CompressOutlined } = require('@mui/icons-material');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register', async(req,res)=>{
    try {
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser=await User.register(user,password);
        res.redirect('/campgrounds');
    } catch (error) {
        console.log(error);
        res.redirect('/register');
    }
   
//    console.log(registeredUser);
   
});

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    console.log('welcome Back!')
    res.redirect('/campgrounds')
})
module.exports=router;
