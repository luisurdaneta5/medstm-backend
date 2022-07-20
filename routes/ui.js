const express = require("express");
const { getCountries } = require("../controllers/ui");
const router = express.Router();

router.get("/countries_available", getCountries);

module.exports = router;
