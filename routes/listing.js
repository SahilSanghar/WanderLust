const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",")
        console.log(errMsg)
        throw new ExpressError(404, errMsg)
    } else {
        next()
    }
}

//Index route
router.get("/", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings })
}))

//Create route
router.get("/new",isLoggedIn , (req,res) => {
    res.render("new.ejs");
})


//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing) {
    req.flash("error", "Requested listing does not exist!")
    res.redirect("/listings")
    }
    console.log(listing)
    res.render("show.ejs", { listing })
}))

//Create route
router.post("/",isLoggedIn ,validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listings created!")
    res.redirect("/listings");
}))

//Edit route
router.get("/:id/edit",isLoggedIn , wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Requested listing does not exist!")
        res.redirect("/listings")
    }
    res.render("edit.ejs", {listing})
}))

//Update route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async(req, res) => {
    let {id} =req.params;
    let img = {filename: "listingimage", url: req.body.listing.image}
    await Listing.findByIdAndUpdate(id, {...req.body.listing, image: {...img}});
    req.flash("success", "Listings updated!")
    res.redirect(`/listings/${id}`)
}))

//Delete route
router.delete("/:id",isLoggedIn , wrapAsync(async(req, res) => {
    let {id} =req.params;
    let deletedLisiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLisiting)
    req.flash("success", "Listings deleted!")
    res.redirect(`/listings`)
}))

module.exports = router;