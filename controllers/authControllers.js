const User = require("../models/user");
const jwt = require("jsonwebtoken");

//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not regisstered";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.email = "the password is incorrect";
  }

  //duplicate email
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "deepak secret", {
    expiresIn: maxAge,
  });
};

function handleGetSignup(req, res) {
  res.render("signup");
}
function handleGetLogin(req, res) {
  res.render("login");
}

async function handlePostSignup(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);

    res.status(400).json({ errors });
  }
}

async function handlePostLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
     const token = createToken(user._id);
     res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
     res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

function handleGetLogout(req, res) {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
  
}

module.exports = {
  handleGetSignup,
  handleGetLogin,
  handlePostSignup,
  handlePostLogin,
  handleGetLogout,
};
