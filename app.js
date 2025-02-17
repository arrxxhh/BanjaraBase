const express=require('express');
const app = express();
const path =require('path');
const mongoose = require('mongoose');
const campground=require('./models/campground');
const methodOverride =  require('method-override');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true, depreciated because mongoose now creates indexes itself latest@mongodb
    useUnifiedTopology:true
});

//database connection
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));



//Routes

app.get('/',(req,res)=>{
    res.render('home')
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

app.put('campgrounds/:id', async(req,res)=>{
    const {id}= req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
})

// app.get('/makecampground',async(req,res)=>{
//     const camp = new campground({title:'My Backyard',description:'cheap camping'});
//     await camp.save();
//     res.send(camp)
// })


app.listen(4000,()=>{
    console.log('Serving on port 4000')
})