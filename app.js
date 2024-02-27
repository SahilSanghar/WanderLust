const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const mongo_url = "mongodb://127.0.0.1:27017/WanderLust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(()=> {
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(mongo_url)
}

//Testing route
app.get("/",(req, res)=> {
    res.send("Hi, I am root")
})

//Router
app.use("/listings", listings)
app.use("listings/:id/reviews", reviews)

app.listen(8080, ()=> {
    console.log("App is listening to port 8080")
})

//Error handler

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next) => {
    let { statusCode= 500, message= "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})