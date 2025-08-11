const app = require("./app");

const connectToDb = require("./config/connectToDB");

const connectToCloudinary = require("./config/cloudinary");

console.log("Hello");

app.listen("3700", () => {
  console.log(`Server is running on port 3700`);
});

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to Homepage",
  });
});

connectToDb();
connectToCloudinary();
