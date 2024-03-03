const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { tr } = require("@faker-js/faker");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users")

//Sign Up
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))


//Log in
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", 
    {failureRedirect: "/login", 
    failureFlash: true}), 
    userController.login)

//Log out
router.get("/logout", userController.logout)

module.exports = router;