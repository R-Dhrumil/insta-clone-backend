const mongoose = require("mongoose");

const followeSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "follower id is required for creating the follow"],
    },
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "followee id is required for creating the follow"],
    },
    status:{
      type: String,
      default: "pending",
      enum: {
        values: ["accept", "pending" , "reject"],
        message: "status can only be pending , accepted or rejected"
      }
    }
  },
  {
    timestamps: true,
  },
);

followeSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followeModel = mongoose.model("follows", followeSchema);

module.exports = followeModel;
