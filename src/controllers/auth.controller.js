const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function registerController(req, res) {
  const { email, username, password, bio, profile_img } = req.body;

  const isUserExistsByEmail = await userModel.findOne({ email });

  //   if (isUserExistsByEmail) {
  //     return res.status(409).json({
  //       message: "User already exists with same email",
  //     });
  //   }

  //   const isUserExistsByUserName = await userModel.findOne({ username });

  //   if (isUserExistsByUserName) {
  //     return res.status(409).json({
  //       message: "User already exists with same name",
  //     });
  //   }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(`user ${isUserAlreadyExists.email} already exists`);

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "User already exists" + isUserAlreadyExists.email == email
          ? "Email already exists"
          : "Username already exists ",
    });
  }
  /**salt numbr = number of the hasing
   *
   */
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    username,
    bio,
    profile_img,
    password: hash,
  });

  const token = jwt.sign(
    /**
     * user's data
     * uique data
     */
    {
      id: user._id,
      username: username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User register done",
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profile_img: user.profile_img,
    },
  });
}

async function loginController(req, res) {
  const { email, username, password } = req.body;

  /**
   * user can be log in with
   * username
   * password
   *
   * email
   * password
   *
   */

  const user = await userModel.findOne({
    // $or operator takes array of the condition like if we have username so find the username in the database

    $or: [
      {
        /**
      condition */
        username: username,
      },
      {
        /**
         * condition */
        email: email,
      },
    ],
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isMatching = bcrypt.compare(password, user.password);

  if (!isMatching) {
    return res.status(409).json({
      message: "Password is invalid",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User loged in",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profile_img: user.profile_img,
    },
  });
}

module.exports = {
  registerController,
  loginController,
};
