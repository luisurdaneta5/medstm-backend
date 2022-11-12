const express = require("express");
const { createWithdrawal } = require("../controllers/withdrawals");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.post("/create", validarJWT, createWithdrawal);

module.exports = router;
