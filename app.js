const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")

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

//Index route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings })
})

//Create route
app.get("/listings/new", (req,res) => {
    res.render("new.ejs");
})


//Show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing })
})

//Create route
app.post("/listings",async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", {listing})
})

//Update route
app.put("/listings/:id", async(req, res) => {
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`)
})

//Delete route
app.delete("/listings/:id", async(req, res) => {
    let {id} =req.params;
    let deletedLisiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLisiting)
    res.redirect(`/listings`)
})
app.listen(8080, ()=> {
    console.log("App is listening to port 8080")
})

// app.get("/testing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Vila",
//         description: "By the beach",
//         price: 1200,
//         location: "Ahmedabad, Gujarat",
//         country: "India",
//     });
//     await sampleListing.save()
//     console.log("Sample was saved")
//     res.send("Successful testing")
// })