const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4 } = require("uuid");
const { ctrlWrapper, HttpError, sendMail } = require("../helpers");
const { User } = require("../models/user");

const { JWT_SECRET } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = v4();
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendMail({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      password: newUser.password,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not confirmed");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "10d" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  res.json({ email, subscription: user.subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  Jimp.read(resultUpload)
    .then((image) => {
      return image.resize(250, 250);
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.json({
    avatarURL,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.json({
    message: "Verification successful",
  });
};

const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    throw HttpError(400, "missing required field email");
  }

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await sendMail({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Confirm your email</a>`,
  });

  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerification: ctrlWrapper(resendVerification),
};
