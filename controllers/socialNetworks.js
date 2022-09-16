const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const socialNetwork = require("../models/socialNetwork");

const getSocialNetwork = async (req, res = response) => {
	const { id } = req.query;

	try {
		const data = await socialNetwork.findOne({
			where: {
				userId: id,
			},
			attributes: {
				exclude: "id, userId,createdAt, updatedAt",
			},
		});

		res.status(200).json({
			ok: true,
			data,
		});
	} catch (error) {
		console.log(error);
	}
};

const updateSocialNetwork = async (req, res = response) => {
	const { id, facebook, instagram, twitter, linkedin } = req.body;

	try {
		await socialNetwork.update(
			{
				facebook: facebook,
				instagram: instagram,
				twitter: twitter,
				linkedin: linkedin,
			},
			{
				where: {
					userId: id,
				},
			}
		);

		res.status(200).json({
			ok: true,
			message: "Actualizacion exitosa.",
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getSocialNetwork,
	updateSocialNetwork,
};
