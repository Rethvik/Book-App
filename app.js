const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");

// Mongoose Connection
const dbUrl =
  "mongodb+srv://rethvik:rethvik@nodejs.xupzf.mongodb.net/Users?retryWrites=true&w=majority";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((error) => console.log(error));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Routes
app.get("/", async (req, res) => {
  res.render("index");
});
app.get("/show", async (req, res) => {
  const found = await User.find({});
  res.render("show", { title: "All Users", found });
});
app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  const { ReferedUser } = req.body;
  refUser = ReferedUser.toLowerCase();
  const found = await User.findOne({ ReferedUser: refUser });
  if (found === null) {
    res.status(400).json({ message: "user not found" });
    return;
  }
  if (ReferedUser === "") {
    ReferedUser = null;
  }
  const p = new User(req.body);
  await p.save();
  res.status(200).json({ success: true });
});

app.post("/pay-update/:id", async (req, res) => {
  const found = await User.findById(req.params.id);
  const referedUser = found.ReferedUser;
  if (referedUser !== null) {
    const foundRefered = await User.findOne({ Name: referedUser });
    const earnings = foundRefered.TotalEarnings + 10;
    await User.updateOne({ Name: referedUser }, { TotalEarnings: earnings });
  }
  await User.findByIdAndUpdate(req.params.id, {
    isPaymentMade: true,
  });
  res.redirect("/show");
});

// Connectiong to the App
app.listen(3000, () => {
  console.log("Connected to the app");
});
