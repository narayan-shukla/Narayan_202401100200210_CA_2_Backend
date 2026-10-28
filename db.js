const mongoose = require("mongoose");

const db =mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("MongoDB connected"))
    .catch((err)=> {
        console.log("MongoDB connection failed", err);
        process.exit(1);
    });
module.exports = db;