const express = require("express");
const {
	getCountries,
	getCountUsers,
	getRequests,
	getNotices,
	getSpecialities,
	getPlansFree,
	getPlansPremiun,
	getPlansVip,
	getPlansPayment,
} = require("../controllers/ui");
const { validarJWT } = require("../middlewares/validarjwt");
const router = express.Router();

router.get("/countries_available", getCountries);

router.get("/users", getCountUsers);

router.get("/requests", getRequests);

router.get("/notices", getNotices);

router.get("/specialities", getSpecialities);

router.get("/plans/free", getPlansFree);

router.get("/plans/premiuns", getPlansPremiun);

router.get("/plans/vips", getPlansVip);

router.get("/plans/payment", validarJWT, getPlansPayment);

module.exports = router;
