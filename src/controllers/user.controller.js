const followeModel = require("../models/followe.model");
const userModel = require("../models/user.model");

async function followeUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  try {
    const isFolloweeExists = await userModel.findOne({
      username: followeeUsername,
    });

    console.log(isFolloweeExists);

    if (!isFolloweeExists) {
      return res.status(404).json({
        message: "User you are trying to follow dosen't exists",
      });
    }

    if (followeeUsername === followerUsername) {
      return res.status(400).json({
        message: "You can not follow your self",
      });
    }

    const isAlreadyFollowing = await followeModel.findOne({
      followee: followeeUsername,
      follower: followerUsername,
    });

    if (isAlreadyFollowing) {
      return res.status(200).json({
        message: `You are already following ${followeeUsername}`,
        follow: isAlreadyFollowing,
      });
    }

    const followRecord = await followeModel.create({
      follower: followerUsername,
      followee: followeeUsername,
    });

    res.status(201).json({
      message: `You are now following ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isAlreadyFollowing = await followeModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (!isAlreadyFollowing) {
    return res.status(200).json({
      message: "You are not following " + followeeUsername,
    });
  }

  await followeModel.findByIdAndDelete(isAlreadyFollowing._id);

  res.status(200).json({
    messsage: "You have unfollowed " + followeeUsername,
  });
}

async function getAllFollowRequests(req, res) {
  const username = req.user.username;

  const follows = await followeModel.find({
    followee: username,
  });

  if (follows.length == 0) {
    return res.status(404).json({
      message: "You don't have any friend requests",
    });
  }

  res.status(200).json({
    follows,
  });
}

async function acceptFollowRequest(req, res) {
  const username = req.user.username;
  const followId = req.params.followId;

  const followRecord = await followeModel.find({
    followee: username,
    _id: followId,
    status: "accept",
  });

  if (followRecord) {
    return res.status(200).json({
      message: "Request already accepted",
    });
  }

  if (!followRecord) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  const follows = await followeModel.findOneAndUpdate(
    {
      $and: [{ followee: username }, { _id: followId }],
    },
    { status: "accept" },
  );

  return res.status(200).json({
    message: "Request accepted",
    follows,
  });
}

async function rejectFollowRequest(req, res) {
  const username = req.user.username;
  const followId = req.params.followId;
  const follows = await followeModel.findOneAndUpdate(
    {
      $and: [{ followee: username }, { _id: followId }],
    },
    { status: "reject" },
  );

  return res.status(200).json({
    message: "Request rejected",
    follows,
  });
}
module.exports = {
  followeUserController,
  unfollowUserController,
  getAllFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest
};
