const { response } = require("express");
const { sequelize } = require("../models/db");
const User = require("../models/users");
const Referral = require("../models/referrals");

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

module.exports = {
	getCountries,
};
