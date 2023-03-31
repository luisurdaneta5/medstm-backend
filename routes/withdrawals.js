const express = require("express");
const { createWithdrawal, getWithdrawal } = require("../controllers/withdrawals");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.post("/create", validarJWT, createWithdrawal);

router.get("/get", validarJWT, getWithdrawal);

module.exports = router;
