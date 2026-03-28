const mongoose = require("mongoose");

const followeSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
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
