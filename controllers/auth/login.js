const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { HttpError } = require("../../helpers");

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
  res.json({
    token: "exampletoken",
    user: {
      email,
      subscription: "starter",
    },
  });
};

module.exports = login;
