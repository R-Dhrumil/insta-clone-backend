const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  imgUrl: {
    type: String,
    requierd: [true, "img is require to create an post"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "user id is required for creating the post"],
  },
});

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
