const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const {
	createUser,
	getUsersInactive,
	getUserInactive,
	setApproveUser,
	setRejectUser,
	getUsers,
	ChangePassword,
	changeAvatar,
	getUserforProfile,
	changeName,
	changePhone,
	changeEmail,
	createUserAdmin,
	getUserForEdit,
	updateUser,
} = require("../controllers/users");
const { validarJWT } = require("../middlewares/validarjwt");

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

router.get("/requests/inactive", validarJWT, getUsersInactive);

router.get("/request/inactive", validarJWT, getUserInactive);

router.put("/approved", validarJWT, setApproveUser);

router.delete("/rejected/:id", validarJWT, setRejectUser);

router.get("/all", validarJWT, getUsers);

router.put("/change-password", validarJWT, ChangePassword);

router.post("/upload/avatar", validarJWT, changeAvatar);

router.get("/profile", validarJWT, getUserforProfile);

router.put("/profile/changeName", validarJWT, changeName);

router.put("/profile/changePhone", validarJWT, changePhone);

router.put("/profile/changeEmail", validarJWT, changeEmail);

//Dashboard

router.post("/dashboard/createUser", validarJWT, createUserAdmin);

router.get("/dashboard/editUser", validarJWT, getUserForEdit);

router.put("/dashboard/updateUser", validarJWT, updateUser);

module.exports = router;
