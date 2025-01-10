const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const { requireAuth, checkUser}= require('./middlewares/authMiddleware')

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://yoshi:yoshi123@cluster-auth.mqsce.mongodb.net/SmoothieDb";
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

