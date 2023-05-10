const express = require("express");
const router = express.Router();
const controller = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const schemas = require("../../schemas/user");
const { ctrlWrapper } = require("../../helpers");

router.post(
  "/register",
  validateBody(schemas.authSchema),
  ctrlWrapper(controller.register)
);

// router.post("/login", validateBody(schemas.authSchema), controller.login);

// router.post("/logout", controller.logout);

module.exports = router;
