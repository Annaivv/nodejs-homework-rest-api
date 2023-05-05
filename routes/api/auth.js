const express = require("express");
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const router = express.Router();
// const ctrlWrapper = require("../../helpers/ctrlWrapper");
const controller = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const schemas = require("../../schemas/user");

router.post(
  "/register",
  validateBody(schemas.authSchema),
  ctrlWrapper(controller.registration)
);

router.post(
  "/login",
  validateBody(schemas.authSchema),
  ctrlWrapper(controller.login)
);

module.exports = router;
