const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {validUser, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js");
const { route } = require("./listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router
.route("/")
 .get(wrapAsync(listingController.index))
.post(validUser, upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


// NEW ROUTE
router.get("/new",validUser, listingController.renderNewForm);

router.post("/search",listingController.searchByCountry);

router
.route("/:id")
.put(validUser,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(validUser,isOwner, wrapAsync(listingController.destroyListing))
.get(wrapAsync(listingController.showListing));


// EDIT ROUTE
router.get("/:id/edit",validUser,isOwner, wrapAsync(listingController.renderEditForm));



module.exports=router;