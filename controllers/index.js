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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
    res.render("edit.ejs", {listing})
}

module.exports.updateListing = async(req, res) => {
    let {id} =req.params;
    let img = {filename: "listingimage", url: req.body.listing.image}
    await Listing.findByIdAndUpdate(id, {...req.body.listing, image: {...img}});
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