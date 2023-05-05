const express = require("express");
const router = express.Router();
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const controller = require("../../controllers/user");
const { auth } = require("../../middlewares/");
// const { validateBody } = require("../../middlewares");
// const schemas = require("../../schemas/user");

router.get("/current", ctrlWrapper(auth), ctrlWrapper(controller.getInfo));
router.get("/contacts", ctrlWrapper(auth), ctrlWrapper(controller.getContacts));

module.exports = router;
