const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payments");

const setPayment = async (req, res = response) => {
	const {
		binanceUser,
		transactionId,
		paymentDate,
		selected,
		planSelected,
		userId,
	} = req.body;

	const data = {
		id: uuidv4(),
		userId,
		binanceUser,
		transactionId,
		paymentDate,
		status: 0,
		amount: selected,
		plan: planSelected,
	};

	try {
		const payment = new Payment(data);
		await payment.save();

		res.status(200).json({
			ok: true,
			message: "Gracias por su Afiliacion",
		});
	} catch (error) {
		console.log(error);
	}
};

const getPaymentStatus0 = async (req, res = response) => {
	const { uid } = req.query;

	console.log(uid);

	try {
		const payment = await Payment.findOne({
			where: {
				userId: uid,
				status: 0,
			},
		});

		if (payment) {
			const exist = true;
			res.status(200).json({
				ok: true,
				exist,
			});
		} else {
			const exist = false;
			res.status(200).json({
				ok: true,
				exist,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	setPayment,
	getPaymentStatus0,
};
