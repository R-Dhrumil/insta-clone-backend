const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middleware/auth.middleware");

/**
 * @route POST /api/post - [protected (only accessible by the valid token)]
 * req.body = { caption: String, image: File }
 * @des Create a new post with an image and caption. The image is uploaded as a file in the request, and the caption is sent as a string in the request body. The server will handle the file upload and save the post details in the database.
 */

postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  postController.createPostController,
);

/**
 * @route GET /api/post - [protected (only accessible by the valid token)]
 * req.body = {}
 * @desc Get all posts created by the authenticated user. The server will retrieve the posts from the database and return them in the response.
 */
postRouter.get("/", identifyUser, postController.getPostController);

/**
 * @route GET /api/post/details/:postId - [protected (only accessible by the valid token)]
 * req.body = {}
 * @desc Get the details of a specific post by its ID. The server will retrieve the post details from the database and return them in the response.
 */
postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getDetailsController,
);

/**
 * @route POST /api/post/like/:postId - [protected (only accessible by the valid token)]
 * req.body = {}
 * @desc Like a specific post by its ID. The server will update the like count for the post in the database and return a success message in the response.
 */
postRouter.post(
  "/like/:postId",
  identifyUser,
  postController.likePostController,
);

/**
 * @route GET /api/post/feed - [get all post of the user]
 * @desc Get the feed of posts from users that the authenticated user follows. The server will retrieve the posts from the database and return them in the response.
 */

postRouter.get("/feed", postController.feedController);

module.exports = postRouter;
