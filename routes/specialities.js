const express = require("express");
const { CreateSpeciality, getSpecialities, getSpeciality, UpdateSpeciality, DeleteSpeciality, setSpecialityUser, deleteSpecialityUser } = require("../controllers/specialities");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.get("/get", validarJWT, getSpecialities);

router.get("/single/get", validarJWT, getSpeciality);

router.post("/create", validarJWT, CreateSpeciality);

router.put("/update", validarJWT, UpdateSpeciality);

router.delete("/delete", validarJWT, DeleteSpeciality);

router.post("/setSpecialityUser", validarJWT, setSpecialityUser);

router.delete("/deleteSpecialityUser", validarJWT, deleteSpecialityUser);

module.exports = router;
