const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const {
	createUser,
	getUsersInactive,
	getUserInactive,
} = require("../controllers/users");

const router = express.Router();

router.post(
	"/create",
	[
		check("name", "El nombre es obligatorio").not().isEmpty(),
		check("lastname", "El apellido es obligatorio").not().isEmpty(),
		check("email", "Ingrese un email valido").isEmail(),
		check("country", "El pais es obligatoria").not().isEmpty(),
		check("city", "La ciudad es obligatoria").not().isEmpty(),
		check("phone", "El telefono es obligatorio").not().isEmpty(),
		check("province", "La provincia es obligatorio").not().isEmpty(),
		validateFields,
	],
	createUser
);

router.get("/requests/inactive", getUsersInactive);

router.get("/request/inactive", getUserInactive);

module.exports = router;
