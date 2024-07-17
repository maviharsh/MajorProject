const Listing=require("./Models/listing");
const Review=require("./Models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.validUser=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            console.log(req.session.redirectUrl);
            req.flash("error","You Must Be Logged In");
           return res.redirect("/login");
        }
        
        next();
        
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    
    next();
    
};

module.exports.isOwner=async (req,res,next)=>{

    let { id } = req.params;
    const list=await Listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id))
        {
             req.flash("error","You Are Not The Owner Of This Listing");
             return res.redirect(`/listings/${id}`);
        }
    next();
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
         
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }
    else
    {
        next();
    }
};


module.exports.isAuthor=async (req,res,next)=>{

    let { reviewId,id } = req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
        {
             req.flash("error","You Are Not The Author Of This Review");
             return res.redirect(`/listings/${id}`);
        }
    next();
}
