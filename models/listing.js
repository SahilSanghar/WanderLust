const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,
        url: String,
        // default: "https://varnitec.com/sites/default/files/2020-06/2.jpg",
        // set: (v) => v === ""? "https://varnitec.com/sites/default/files/2020-06/2.jpg": v,

    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
}); 

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;