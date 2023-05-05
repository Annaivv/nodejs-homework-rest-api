const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { HttpError } = require("../../helpers");
const { JWT_SECRET } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({
    token,
    user: {
      email,
      subscription: "starter",
    },
  });
};

module.exports = login;
