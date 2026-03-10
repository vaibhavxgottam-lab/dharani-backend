const mongoose = require("mongoose");

const connectDB = async () => {
    // This tells the app: Use the Render environment variable, 
    // but fall back to local if it's not there.
    const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dharani";

    try {
        await mongoose.connect(url);
        console.log("MongoDB Connected successfully to Atlas");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Stop the server if the database fails
    }
}

module.exports = connectDB;