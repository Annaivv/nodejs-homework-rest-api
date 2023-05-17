const Contact = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner });
  console.log(result.name);
  res.json(result);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  if (result.owner.toString() !== owner.toString()) {
    throw HttpError(401);
  }

  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
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

  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  if (result.owner.toString() !== owner.toString()) {
    throw HttpError(401);
  }

  const updateResult = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updateResult);
};

const updateStatusContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing field favorite",
    });
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
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
