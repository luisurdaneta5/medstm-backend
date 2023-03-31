const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payments");
const User = require("../models/users");
const moment = require("moment");

const setPayment = async (req, res = response) => {
	const { binanceUser, transactionId, paymentDate, selected, planSelected, userId } = req.body;

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

const getPayments = async (req, res = response) => {
	try {
		const payments = await Payment.findAll({
			include: {
				model: User,
				attributes: {
					exclude: ["createdAt", "updatedAt", "type", "password", "phone", "country", "country_code", "province", "city", "status"],
				},
			},
			attributes: {
				exclude: ["userId"],
			},
		});

		res.status(200).json({
			ok: true,
			payments,
		});
	} catch (error) {
		console.log(error);
	}
};

const getPayment = async (req, res = response) => {
	const body = req.query;

	try {
		const payment = await Payment.findOne({
			where: {
				id: body.paymentId,
			},
			include: {
				model: User,
				attributes: {
					exclude: ["createdAt", "updatedAt", "type", "password", "phone", "country", "country_code", "province", "city", "status"],
				},
			},
		});
		res.status(200).json({
			ok: true,
			payment,
		});
	} catch (error) {
		console.log(error);
	}
};
const setPaymentSuccess = async (req, res = response) => {
	const body = req.body;

	try {
		const user = await User.findOne({
			where: {
				id: body.id,
			},
		});

		const date_venciment = moment().add(1, "M");

		user.update({
			...user,
			plan: body.plan,
			date_venciment: date_venciment,
		});

		const payment = await Payment.findOne({
			where: {
				id: body.paymentId,
			},
		});

		payment.update({
			...payment,
			status: body.status,
		});

		res.status(200).json({
			ok: true,
			message: "Pago aceptado",
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	setPayment,
	getPaymentStatus0,
	getPayments,
	setPaymentSuccess,
	getPayment,
};
