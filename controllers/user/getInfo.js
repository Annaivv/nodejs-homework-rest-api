const getInfo = (req, res) => {
  const { user } = req;
  res.json(user);
};

module.exports = getInfo;
