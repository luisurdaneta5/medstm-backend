const express = require("express");
const { check } = require("express-validator");
const {
	setAddress,
	getAddressUser,
	deleteAddress,
} = require("../controllers/addresses");
const { validarJWT } = require("../middlewares/validarjwt");
const { validateFields } = require("../middlewares/validateFields");

const router = express.Router();

router.post("/create", validarJWT, setAddress);

router.get("/getAddress", validarJWT, getAddressUser);

router.delete("/deleteAddress", validarJWT, deleteAddress);

module.exports = router;
