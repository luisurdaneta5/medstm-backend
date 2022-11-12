const { response } = require("express");
const { sequelize } = require("../models/db");
const User = require("../models/users");
const Referral = require("../models/referrals");
const Notice = require("../models/notices");
const Speciality = require("../models/specialities");
const Plan = require("../models/plans");
const { Op } = require("sequelize");

const getCountries = async (req, res = response) => {
	try {
		const countries = await User.findAll({
			attributes: [
				[sequelize.col("country_code"), "country"],
				[sequelize.fn("COUNT", sequelize.col("country_code")), "value"],
			],
			group: ["country_code"],
			where: {
				status: 1,
				type: 3,
			},
		});

		res.status(200).json({
			ok: true,
			countries,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener los paises",
		});
	}
};

const getCountUsers = async (req, res = response) => {
	const { type } = req.query;

	try {
		const users = await User.findAll({
			attributes: [
				[sequelize.fn("COUNT", sequelize.col("name")), "count"],
			],
			where: {
				type: type,
				status: [0, 1],
			},
		});

		res.status(200).json({
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener los usuarios",
		});
	}
};

const getRequests = async (req, res = response) => {
	try {
		const users = await User.findAll({
			attributes: [
				[sequelize.fn("COUNT", sequelize.col("name")), "count"],
			],
			where: {
				status: 3,
			},
		});

		res.status(200).json({
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener los usuarios",
		});
	}
};

const getNotices = async (req, res = response) => {
	const { page, size } = req.query;

	try {
		const notices = await Notice.findAndCountAll({
			attributes: {
				exclude: ["id", "editor", "updatedAt"],
			},
			limit: parseInt(size),
			offset: parseInt(page * size),
		});

		res.status(200).json({
			ok: true,
			notices,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener las noticias",
		});
	}
};

const getSpecialities = async (req, res = response) => {
	try {
		const specialities = await Speciality.findAll({
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			specialities,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error",
		});
	}
};

const getPlansFree = async (req, res = response) => {
	try {
		const free = await Plan.findOne({
			attributes: {
				exclude: [
					"id",
					"price_promotor",
					"price_professional",
					"createdAt",
					"updatedAt",
				],
			},
			where: {
				id: 1,
			},
		});
		const plans = await Plan.findAll({
			where: {
				id: {
					[Op.ne]: 1,
				},
			},
		});

		res.status(200).json({
			ok: true,
			free,
			plans,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error",
		});
	}
};

const getPlansPremiun = async (req, res = response) => {
	try {
		const premiuns = await Plan.findAll({
			attributes: {
				exclude: ["id", "createdAt", "updatedAt"],
			},
			where: {
				id: [2, 3, 4, 5],
			},
		});
		const plans = await Plan.findAll({
			where: {
				id: {
					[Op.ne]: 1,
				},
			},
		});

		res.status(200).json({
			ok: true,
			premiuns,
			plans,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error",
		});
	}
};

const getPlansVip = async (req, res = response) => {
	try {
		const vips = await Plan.findAll({
			attributes: {
				exclude: ["id", "createdAt", "updatedAt"],
			},
			where: {
				id: [6, 7, 8, 9],
			},
		});
		const plans = await Plan.findAll({
			where: {
				id: {
					[Op.ne]: 1,
				},
			},
		});

		res.status(200).json({
			ok: true,
			vips,
			plans,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error",
		});
	}
};

const getPlansPayment = async (req, res = response) => {
	const { type } = req.query;

	try {
		if (type == 4) {
			const plans = await Plan.findAll({
				where: {
					name: [
						"Basico",
						"Bronce",
						"Plata",
						"Oro",
						"Zafiro",
						"Rubi",
						"Esmeralda",
						"Diamante",
					],
				},
				attributes: {
					exclude: [
						"id",
						"price_professional",
						"percentage_professional",
					],
				},
			});

			res.status(200).json({
				ok: true,
				plans,
			});
		} else {
			const plans = await Plan.findAll({
				where: {
					name: [
						"Basico",
						"Bronce",
						"Plata",
						"Oro",
						"Zafiro",
						"Rubi",
						"Esmeralda",
						"Diamante",
					],
				},
				attributes: {
					exclude: ["id", "price_promotor", "percentage_promotor"],
				},
			});

			res.status(200).json({
				ok: true,
				plans,
			});
		}
	} catch (error) {}
};

module.exports = {
	getCountries,
	getCountUsers,
	getRequests,
	getNotices,
	getSpecialities,
	getPlansFree,
	getPlansPremiun,
	getPlansVip,
	getPlansPayment,
};
