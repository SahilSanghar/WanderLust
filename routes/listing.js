const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const listingController = require("../controllers/index.js")

//Index and Create route 

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListings)
    ) 

//Create route
router.get("/new",
    isLoggedIn, 
    listingController.renderNewForm)

//Show, update and destroy route

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put
    (isLoggedIn, isOwner,  upload.single('listing[image]'), validateListing, 
    wrapAsync(listingController.updateListing))
    .delete
    (isLoggedIn, isOwner, 
    wrapAsync(listingController.destroyListings))

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm))

module.exports = router;