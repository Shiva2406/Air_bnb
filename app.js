const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require(path.join(__dirname,"models/listing.js"));
const method_override = require("method-override");
const ejsMate = require("ejs-mate");

const Mongo_URl = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to db.")
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(method_override("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Hi, I am root");
});

//Index route
app.get("/listings", async(req,res) => {
    const allListings =  await Listing.find({});
    res.render("Listings/index.ejs", {allListings});
     });

//New route
app.get("/listings/new",(req,res) => {
    res.render("Listings/new.ejs");
});

//Show route
app.get("/listings/:id", async (req, res) => {
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/show.ejs",{listing});
});

//Add new listing
app.post("/listings", async (req,res) => {
    try {
        const listingData = req.body.listing;
        
        // Check for required fields
        if (!listingData.title || listingData.title.trim() === '') {
            return res.send("Title is required for the listing");
        }
        
        const newListing = new Listing(listingData);
        
        // Make sure image is properly structured
        if (!newListing.image || !newListing.image.url) {
            newListing.image = {
                url: "https://images.unsplash.com/photo-1740021838495-591f6a2d97fa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                filename: "default"
            };
        }
        
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        res.send("Error creating listing: " + err.message);
    }
});

//edit route
app.get("/listings/:id/edit", async (req,res) => {
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update route
app.put("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        
        // Ensure image data is properly structured
        const updateData = req.body.listing;
        
        // Check for required fields
        if (!updateData.title || updateData.title.trim() === '') {
            return res.send("Title is required for the listing");
        }
        
        await Listing.findByIdAndUpdate(id, updateData);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.log(err);
        res.send("Error updating listing: " + err.message);
    }
});

//Delete route
app.delete("/listings/:id",async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListings", async (req,res) => {
//     let sampleListing = new Listing({
//         title:"My home",
//         description: "By the beach",
//         price: 1200,
//         location: "Pune",
//         country: "India",
//     })
//    await sampleListing.save();
//    console.log("Listing added successfully");
//    res.send("Successfull testing");
// });


app.listen(8080, () => {
    console.log("server is listening to port 8080.");
} );