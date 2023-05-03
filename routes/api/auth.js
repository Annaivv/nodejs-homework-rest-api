const express = require("express");
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const router = express.Router();
const controller = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const schemas = require("../../schemas/user");

router.post(
  "/",
  validateBody(schemas.registrationSchema),
  ctrlWrapper(controller.registration)
);

module.exports = router;
