const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({  // ✅ Changed from listingsSchema to listingSchema
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename:{
            type: String,
        },
        url:{
            type: String,
            default: "https://images.unsplash.com/photo-1740021838495-591f6a2d97fa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>
            v === " "
                ? "https://images.unsplash.com/photo-1740021838495-591f6a2d97fa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,
        },
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema); 

module.exports = Listing; 
