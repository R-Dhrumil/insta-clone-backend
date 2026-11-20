const postModel = require("../models/post.model");
const Imagekit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const imagekit = new Imagekit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
  publicKey: process.env["IMAGEKIT_PUBLIC_KEY"],
  urlEndpoint: process.env["IMAGEKIT_URL_ENDPOINT"],
});

async function createPostController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file provided" });
    }

    const file = await imagekit.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname || "image",
      folder: "/insta-clone/post",
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: file.url,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    if (error.message.includes("token")) {
      return res.status(401).json({
        error: error.message,
      });
    }
    if (error.message.includes("file")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const posts = await postModel.find({ user: userId });

  res.status(200).json({
    message: "posts fetched done",
    posts,
  });
}

async function getDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findOne({ _id: postId });
  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content",
    });
  }

  res.status(200).json({
    message: "Post details fetched successfully",
    post,
  });
}

async function likePostController(req,res) {

  const username = req.user.username
  const postId = req.params.postId
  const post = await postModel.findOne({_id: postId})


  if(!post){
    return res.status(404).json({
      message: "Post not found"
    })
  }

  const like = await likeModel.create({
    post: postId,
    user: username
  })

  res.status(200).json({
    message: "Post liked successfully",
    like
  })
}


async function feedController(req,res){


  const posts = await postModel.find().populate("user")

  res.status(200).json({
    message:"post fetched successfuly",
    posts
  })

}
module.exports = {
  createPostController,
  getPostController,
  getDetailsController,
  likePostController,
  feedController
};
