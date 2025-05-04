const express=require('express');
const path =require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const methodOverride =  require('method-override');

const reviews=require('./routes/reviews');
const campgrounds=require('./routes/campgrounds');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    //useNewUrlParser:true, depreciated in node 4.0.0
    // useCreateIndex:true, depreciated because mongoose now creates indexes itself latest@mongodb
    //useUnifiedTopology:true depreciated in node 4.0.0
});

//database connection
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))






const User = require('./models/user.js');
const userRoutes=require('./routes/users');
const { post } = require('selenium-webdriver/http');




const sessionConfig={
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie: {
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}



const passport = require('passport');
const passportl = require('passport-local'); //passport local mongoose
//PASSPORT
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportl(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
app.use('/',userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// sample query
// app.get('/makecampground',async(req,res)=>{
//     const camp = new campground({title:'My Backyard',description:'cheap camping'});
//     await camp.save();
//     res.send(camp)
// })




//SERVER CONNECTION
const PORT=4000;
const server= app.listen(PORT,()=>{
    console.log(`Serving on port ${PORT}`);
})
server.on("error",(err)=>{
    if (err.code === "EADDRINUSE") {
        console.warn(`Port ${PORT} is in use. Trying another port...`);
        let newPort = PORT + 1; 
        const altServer = app.listen(newPort, () => {
            console.log(`Server successfully started on port ${newPort}`);
        });
        altServer.on("error", (altErr) => {
            console.error(`Failed to start server on ${newPort}:`, altErr.message);
            process.exit(1); 
        });
    }else{
        console.error(`Server error: ${err.message}`);
        process.exit(1);
    }
});