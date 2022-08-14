const express = require("express");
const {
	CreateNotice,
	getNotices,
	getNotice,
	UpdateNotice,
	DeleteNotice,
} = require("../controllers/blogs");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");

const router = express.Router();

router.post("/create", CreateNotice);

router.get("/get_notices", getNotices);

router.get("/notice", getNotice);

router.put("/update", UpdateNotice);

router.delete("/delete", DeleteNotice);

module.exports = router;
