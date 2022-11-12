const express = require("express");

const { setPayment, getPaymentStatus0 } = require("../controllers/payments");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.post("/create", validarJWT, setPayment);

router.get("/status/0", validarJWT, getPaymentStatus0);

module.exports = router;
