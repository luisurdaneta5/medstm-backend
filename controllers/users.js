const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const uploads = require("../helpers/uploads");
const Document = require("../models/documents");
const Referral = require("../models/referrals");
const User = require("../models/users");

const createUser = async (req, res = response) => {
	const { body } = req;

	const data = {
		...body,
		id: uuidv4(),
		status: 3,
	};

	try {
		const user = new User(data);

		if (data.type == 3) {
			const cv = {
				id: uuidv4(),
				userId: data.id,
				type: 1,
			};

			const degree = {
				id: uuidv4(),
				userId: data.id,
				type: 2,
			};

			uploads(req, res, req.files.file1, cv, "documents");
			uploads(req, res, req.files.file2, degree, "documents");
		}

		await user.save();

		res.status(200).json({
			ok: true,
			message: "Solicitud enviada correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al crear el usuario",
		});
	}
};

const getUsersInactive = async (req, res = response) => {
	try {
		const users = await User.findAll({
			where: {
				status: 3,
			},
		});

		res.status(200).json({
			ok: true,
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

const getUserInactive = async (req, res = response) => {
	const { id } = req.query;

	try {
		// const countries = await User.findAll({
		// 	include: [
		// 		{
		// 			model: Referral,

		// 			attributes: {
		// 				exclude: ["referId", "userId"],
		// 			},
		// 			include: [
		// 				{
		// 					model: User,
		// 				},
		// 			],
		// 		},
		// 	],
		// });

		const user = await User.findOne({
			where: {
				id,
			},
			include: [
				{
					model: Document,
					attributes: {
						exclude: ["userId", "createdAt", "updatedAt"],
					},
				},
				{
					model: Referral,

					attributes: {
						exclude: ["referId", "userId"],
					},
					include: [
						{
							model: User,
							attributes: {
								exclude: [
									"city",
									"country",
									"country_code",
									"email",
									"password",
									"phone",
									"province",
									"status",
									"type",
								],
							},
							where: {
								status: 1,
							},
						},
					],
				},
			],
		});

		res.status(200).json({
			ok: true,
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener el usuario",
		});
	}
};

module.exports = {
	createUser,
	getUsersInactive,
	getUserInactive,
};
