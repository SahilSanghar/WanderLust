const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { tr } = require("@faker-js/faker");
const { saveRedirectUrl } = require("../middleware");

//SignUp
router.get("/signup", (req, res)=> {
    res.render("../users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req, res)=> {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username})
        const registerUser = await User.register(newUser, password)
        console.log(registerUser)
        req.login(registerUser,(err) =>{
            if(err) {
                return next(err)
            }
            req.flash("success", "Welcome to WanderLust!")
            res.redirect("/listings")
        })
    } catch(e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}))


//Login
router.get("/login", (req, res)=> {
    res.render("../users/login.ejs")
})

router.post("/login",saveRedirectUrl , passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true}), 
    async(req, res) => {
        req.flash("success", "Welcome back to WanderLust")
        let redirectUrl = res.locals.redirectUrl || "/listings" 
        res.redirect(redirectUrl)
})

//Log out
router.get("/logout", (req, res, next) => {
    req.logout((err) =>{
        if(err) {
            next(err)
        }
    })
    req.flash("success", "You are logged out!")
    res.redirect("/listings")
})

module.exports = router;