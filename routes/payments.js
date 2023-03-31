const express = require("express");

const { setPayment, getPaymentStatus0, getPayments, setPaymentSuccess, getPayment } = require("../controllers/payments");
const { validarJWT } = require("../middlewares/validarjwt");

const router = express.Router();

router.post("/create", validarJWT, setPayment);

router.get("/status/0", validarJWT, getPaymentStatus0);

router.get("/get", validarJWT, getPayments);

router.put("/setPaymentSucces", setPaymentSuccess);

router.get("/single", getPayment);

module.exports = router;
