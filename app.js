const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")

const mongo_url = "mongodb://127.0.0.1:27017/WanderLust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"))
app.use(express.urlencoded({extended: true}))

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
    console.log(id);
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing })
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