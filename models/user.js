const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: [true, "email must be in lowercase"],
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "password must be at leat 6 characters"],
  },
});

//fire a funtion before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user
 userSchema.statics.login= async function (email,password) {
   const user = await this.findOne({ email });
   if (user) {
     const auth = await bcrypt.compare(password, user.password);
     if (auth) {
       return user;
     }
     throw new Error("incorrect password");
     
     
   }
   throw new Error("incorrect email");
   
 }
const User = mongoose.model("user", userSchema);
module.exports = User;
