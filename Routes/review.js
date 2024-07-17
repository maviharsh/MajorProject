const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, validUser, isAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");

router.post("/",validUser,validateReview,wrapAsync(reviewController.addReview));

router.delete("/:reviewId",validUser,isAuthor,wrapAsync(reviewController.destroyReview)); 

module.exports=router;