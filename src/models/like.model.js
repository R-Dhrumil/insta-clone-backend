const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      require: [true, "Post id is require to create like"],
    },
    user: {
      type: String,
      ref: "user",
      require: [true, "Username is require to create like"],
    },
  },
  {
    timestamps: true,
  },
);

//same user can't like the post for twice
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model('likes', likeSchema)

module.exports = likeModel