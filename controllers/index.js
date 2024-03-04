const Listing = require("../models/listing.js")

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings })
}

module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs");
}

module.exports.showListings = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
    populate: {path: "author"},
})
    .populate("owner");
    if(!listing) {
    req.flash("error", "Requested listing does not exist!")
    res.redirect("/listings")
    }
    console.log(listing)
    res.render("show.ejs", { listing })
}

module.exports.createListings = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    console.log(url, "..", filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New listings created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Requested listing does not exist!")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("edit.ejs", {listing, originalImageUrl})
}

module.exports.updateListing = async(req, res) => {
    let {id} =req.params;
    let img = {filename: "listingimage", url: req.body.listing.image}
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing, image: {...img}});
    if(typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save();
    }
    
    req.flash("success", "Listings updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListings = async(req, res) => {
    let {id} =req.params;
    let deletedLisiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLisiting)
    req.flash("success", "Listings deleted!")
    res.redirect(`/listings`)
}