const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const { requireAuth, checkUser}= require('./middlewares/authMiddleware');
const User = require("./models/user");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

// database connection
dotenv.config();
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(7001, () => console.log("....server connected..."))
  )
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies",requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

