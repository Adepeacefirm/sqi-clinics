const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDb = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);

    if (connected) {
      console.log("MongoDB connected");
    } else {
      throw new Error("Failed to connect to MongoDB");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDb;
