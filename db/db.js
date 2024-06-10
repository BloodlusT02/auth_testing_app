const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/authTestingApp");
        console.log(`MongoDB Database Connected`);
    } catch (error) {
        console.error("ERROR :", error);
        throw error;
    }
};

module.exports = { connectDB }