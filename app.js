const express=require('express');
const app = express();
const path =require('path');
const ejsMate= require('ejs-mate');
const mongoose = require('mongoose');
const campground=require('./models/campground');
const methodOverride =  require('method-override');
const passport = require('passport');
const passportl = require('passport-local');
const session = require('express-session');
const User = require('./models/user.js');

const userRoutes=require('./routes/users');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true, depreciated because mongoose now creates indexes itself latest@mongodb
    useUnifiedTopology:true
});
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
//database connection
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportl(User.authenticate()));
app.use('/',userRoutes);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.get('/',(req,res)=>{
    res.redirect('/campgrounds');
});

app.get('/campgrounds',async (req,res) =>{
    const campgrounds =await campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
});


app.post('/campgrounds', async(req,res)=>{
    const camp=new campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
    
    // if we want to do this res.send(req.body) body is emopty it needs to be parsed to view
})
app.get('/campgrounds/:id',async (req,res) =>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/show', {camp});
});

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
})

app.put('/campgrounds/:id', async(req,res)=>{
    const {id}= req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`)
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const {id} =req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

// app.get('/makecampground',async(req,res)=>{
//     const camp = new campground({title:'My Backyard',description:'cheap camping'});
//     await camp.save();
//     res.send(camp)
// })

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