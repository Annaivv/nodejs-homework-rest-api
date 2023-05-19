const express = require("express");
const router = express.Router();
const { authSchema } = require("../../models/user");
const { validateBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");

router.post("/register", validateBody(authSchema), ctrl.register);

router.post("/login", validateBody(authSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
