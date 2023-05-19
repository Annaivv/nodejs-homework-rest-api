const Contact = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner });

  res.json(result);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOne({ _id: id, owner: owner.toString() });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndDelete({
    _id: id,
    owner: owner.toString(),
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "contact deleted",
  });
};

const updateById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing fields",
    });
  }
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: owner.toString() },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing field favorite",
    });
  }

  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: owner.toString() },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
