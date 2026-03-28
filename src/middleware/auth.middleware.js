const jwt = require("jsonwebtoken");

/**
 * Middleware to identify the authenticated user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function identifyUser(req, res, next) {
  const token = req.cookies.token;
  console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token not provided, Unauthorized access" });
  }
  let decoded = "";
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).send(error);
  }

  req.user = decoded;

  next();
}

module.exports = identifyUser;
