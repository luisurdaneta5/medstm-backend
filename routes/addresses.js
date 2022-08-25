const express = require("express");
const { check } = require("express-validator");
const { setAddress } = require("../controllers/addresses");
const { validateFields } = require("../middlewares/validateFields");

const router = express.Router();

router.post(
	"/create",

	setAddress
);

module.exports = router;
