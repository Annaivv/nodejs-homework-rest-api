const getInfo = (req, res) => {
  const { user } = req;
  res.json({
    email: user.email,
    subscription: "starter",
  });
};

module.exports = getInfo;
