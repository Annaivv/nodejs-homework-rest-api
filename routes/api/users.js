const express = require("express");
const router = express.Router();
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const controller = require("../../controllers/user");
const { auth } = require("../../middlewares/");

router.get("/current", ctrlWrapper(auth), ctrlWrapper(controller.getInfo));
router.get("/contacts", ctrlWrapper(auth), ctrlWrapper(controller.getContacts));
router.post("", ctrlWrapper(auth), ctrlWrapper(controller.addContact));

module.exports = router;
