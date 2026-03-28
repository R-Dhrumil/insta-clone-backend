const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");

const userRouter = express.Router();

/**
 *@route POST /api/user/follow/:username
 *@desc Follow a user
 *@access Private
 */

userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followeUserController,
);

/**
 *@route POST /api/user/unfollow/:username
 *@desc UnFollow a user
 *@access Private
 */

userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
);

/** *@route GET /api/user/allrequests
 *@desc Get all follow requests for the authenticated user
 *@access Private
 */

userRouter.get(
  "/allrequests",
  identifyUser,
  userController.getAllFollowRequests,
);

/** *@route POST /api/user/acceptrequest/:followId
 *@desc Accept a follow request
 *@access Private
 */

userRouter.post(
  "/acceptrequest/:followId",
  identifyUser,
  userController.acceptFollowRequest,
);

/** *@route POST /api/user/rejectrequest/:followId
 *@desc Reject a follow request
 *@access Private
 */

userRouter.post(
  "/rejectrequest/:followId",
  identifyUser,
  userController.rejectFollowRequest,
);
module.exports = userRouter;
