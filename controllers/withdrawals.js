const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Balance = require("../models/balances");
const User = require("../models/users");
const Withdrawal = require("../models/withdrawals");

const createWithdrawal = async (req, res = response) => {
	const body = req.body;

	const data = {
		...body,
		id: uuidv4(),
		status: 0,
	};
	try {
		const balance = await Balance.findOne({
			where: {
				userId: body.userId,
			},
		});

		if (body.amount > balance.balance) {
			res.status(500).json({
				ok: false,
				message: "El monto solicitado supera el balance disponible",
			});
		} else {
			await balance.update({
				balance: balance.balance - body.amount,
			});

			const withdrawal = new Withdrawal(data);
			withdrawal.save();

			res.status(200).json({
				ok: true,
				message: "Solicitud de retiro enviada correctamente",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const getWithdrawal = async (req, res = repsonse) => {
	const body = req.query;

	try {
		const withdrawals = await Withdrawal.findAll({
			attributes: {
				exclude: ["userId"],
			},
			include: {
				model: User,
				attributes: {
					exclude: ["id", "password", "phone", "country", "type", "country_code", "province", "city", "status", "plan", "createdAt", "updatedAt"],
				},
			},
		});

		res.status(200).json({
			ok: true,
			withdrawals,
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createWithdrawal,
	getWithdrawal,
};
