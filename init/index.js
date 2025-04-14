const mongoose = require("mongoose");
const initData = require("./data.js");
const path = require("path");
const Listing = require(path.join(__dirname, "../models/listing.js"));

const Mongo_URl = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to db.");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized.");
}

initDB();