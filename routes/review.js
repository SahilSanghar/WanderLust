const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")
//Post Review route

router.post("/",
        isLoggedIn, 
        validateReview, 
        wrapAsync(reviewController.createReviews))

//Delete Review route
router.delete("/:reviewId", 
        isLoggedIn, 
        isReviewAuthor, 
        wrapAsync(reviewController.destroyReviews))

module.exports = router;