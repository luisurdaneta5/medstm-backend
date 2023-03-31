const express = require("express");
const { getSearch } = require("../controllers/searchs");

const router = express.Router();

router.get("/get", getSearch);

module.exports = router;
