const express = require("express");
const {
	CreateSpeciality,
	getSpecialities,
	getSpeciality,
	UpdateSpeciality,
	DeleteSpeciality,
	setSpecialityUser,
} = require("../controllers/specialities");

const router = express.Router();

router.get("/get", getSpecialities);
router.post("/create", CreateSpeciality);

router.get("/", getSpeciality);

router.put("/update", UpdateSpeciality);

router.delete("/delete", DeleteSpeciality);

router.post("/setSpecialityUser", setSpecialityUser);
module.exports = router;
