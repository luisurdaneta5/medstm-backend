const express = require("express");
const {
	getSocialNetwork,
	updateSocialNetwork,
} = require("../controllers/socialNetworks");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.get("/getSocial", validarJWT, getSocialNetwork);

router.put("/updateSocial", validarJWT, updateSocialNetwork);

module.exports = router;
