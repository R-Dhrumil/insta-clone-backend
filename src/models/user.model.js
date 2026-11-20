const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "User name already exists"],
    require: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    require: [true, "Email is required"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    select: false, // it stopes reading this feild
  },
  bio: String,

  profile_img: {
    type: String,
    default: "https://ik.imagekit.io/fab15h2jph/user_img.jpg",
  },
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
