const express=require('express');
const router=express.Router();
const campground=require('../models/campground');

router.get('/',async (req,res) =>{
    const campgrounds =await campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

router.get('/new', (req,res)=>{
    res.render('campgrounds/new')
});


router.post('/', async(req,res)=>{
    const camp=new campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
    
    // if we want to do this res.send(req.body) body is emopty it needs to be parsed to view
})
router.get('/:id',async (req,res) =>{
    const camp=await campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {camp});
});

router.get('/:id/edit', async (req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
})

router.put('/:id', async(req,res)=>{
    const {id}= req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`)
})

router.delete('/:id', async(req,res)=>{
    const {id} =req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

module.exports=router;
