const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { HttpError } = require("../helpers");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw HttpError(401, "Token type is not valid");
  }

  if (!token) {
    throw HttpError(401, "No token provided");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw HttpError(401, "Not authorized");
    }
  }

  next();
};

module.exports = auth;
