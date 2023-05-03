const User = require("../../models/user");
const { HttpError } = require("../../helpers");

const registration = async (req, res) => {
  const result = await User.create(req.body);
  res.status(201).json({
    user: {
      email: result.email,
      subscription: "starter",
    },
  });
};

module.exports = registration;
