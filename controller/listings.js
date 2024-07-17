const Listing = require("../Models/listing.js");

module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    console.log(req.body);
    res.render("listings/index", { allListings });
};

module.exports.searchByCountry=async(req,res)=>{
    let {country}=req.body;
    console.log(country);
     if(country=="")
     {
        let allListings = await Listing.find({});
       return res.render("listings/index", { allListings });
     }
    
    let result=country[0].toUpperCase()+country.substr(1);
   
    let allListings = await Listing.find({country:result});
   
    res.render("listings/index", { allListings });
     
}

module.exports.renderNewForm=(req, res) => {
    
    res.render("listings/new");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const list = await Listing.findById(id)
    .populate(
        {path:"reviews",
            populate:{
                path:"author",
            },
        }).populate("owner");
    
    if(!list)
    {
        req.flash("error","Listing That You Are Trying To Find Does Not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show", { list });
};

module.exports.createListing=async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created Successfully");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
        {
            req.flash("error","Listing That You Are Trying To Find Does Not Exist");
            res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing,originalImageUrl });
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","The Listing Was Deleted Successfully");
    res.redirect("/listings");
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
       
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","The Listing Was Updated Successfully");

    res.redirect(`/listings/${id}`);

};