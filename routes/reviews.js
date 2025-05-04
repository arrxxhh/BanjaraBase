const express=require('express');
const router=express.Router({mergeParams:true});
const campground=require('../models/campground');
const Review = require('../models/review');

router.post('/', async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
})

router.put('/:reviewId', async(req,res)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, {...req.body.review});
    res.redirect(`/campgrounds/${id}`);
})

router.delete('/:reviewId', async(req,res)=>{
    const {id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
})

module.exports=router;