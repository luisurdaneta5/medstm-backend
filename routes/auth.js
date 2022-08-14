const express = require("express");
const { check } = require("express-validator");
const { setLogin, revalidarToken } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validateFields");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.post(
	"/login",
	[
		check("email", "Ingrese un Correo Electronico").not().isEmpty(),
		check("email", "Ingrese un Correo Electronico valido").isEmail(),
	],
	validateFields,
	setLogin
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
