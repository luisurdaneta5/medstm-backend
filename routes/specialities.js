const exporess = require("express");
const {
	CreateSpeciality,
	getSpecialities,
	getSpeciality,
	UpdateSpeciality,
	DeleteSpeciality,
} = require("../controllers/specialities");

const router = exporess.Router();

router.get("/get", getSpecialities);
router.post("/create", CreateSpeciality);

router.get("/", getSpeciality);

router.put("/update", UpdateSpeciality);

router.delete("/delete", DeleteSpeciality);

module.exports = router;
