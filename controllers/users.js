const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const uploads = require("../helpers/uploads");
const Document = require("../models/documents");
const Referral = require("../models/referrals");
const path = require("path");
const User = require("../models/users");

const createUser = async (req, res = response) => {
	const { body } = req;

	const data = {
		...body,
		id: uuidv4(),
		status: 3,
	};

	try {
		let user = await User.findOne({
			where: {
				email: data.email,
			},
		});

		if (user) {
			return res.status(500).json({
				ok: false,
				message: "Existe una Solicitud pendiente con este correo",
			});
		} else {
			user = new User(data);

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
		}
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

const setApproveUser = async (req, res = response) => {
	const { id } = req.body;

	const salt = bcrypt.genSaltSync();

	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let password = Math.random().toString(36).substring(0, 8);

	try {
		await User.update(
			{
				status: 1,
				password: bcrypt.hashSync(password, salt),
				plan: "Gratis",
			},
			{
				where: {
					id,
				},
			}
		);

		res.status(200).json({
			ok: true,
			message: "Usuario aprobado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al aprobar el usuario",
		});
	}
};

const setRejectUser = async (req, res = response) => {
	const { id } = req.params;

	try {
		await User.destroy({
			where: { id },
		});
		await Document.destroy({
			where: {
				userId: id,
			},
		});
		await Referral.destroy({
			where: {
				referId: id,
			},
		});

		res.status(200).json({
			ok: true,
			message: "Usuario rechazado y eliminado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al rechazar el usuario",
		});
	}
};

const getUsers = async (req, res = response) => {
	const { type } = req.query;
	try {
		const users = await User.findAll({
			attributes: {
				exclude: [
					"city",
					"code_country",
					"country",
					"phone",
					"email",
					"type",
					"password",
					"createdAt",
					"updatedAt",
					"province",
				],
			},
			where: {
				type: type,
				status: [1, 0],
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

const ChangePassword = async (req, res = response) => {
	const { id, password } = req.body;

	try {
		const salt = bcrypt.genSaltSync();
		const hash = bcrypt.hashSync(password, salt);
		await User.update(
			{
				password: hash,
			},
			{
				where: {
					id,
				},
			}
		);
		res.status(200).json({
			ok: true,
			message: "Contraseña cambiada correctamente",
		});
	} catch (error) {}
};

const changeAvatar = async (req, res = response) => {
	const { uid, id } = req.body;
	const { image } = req.files;

	if (id) {
		try {
			const avatar = await Document.findOne({
				where: {
					id,
				},
			});

			const uploadPath = path.join(
				__dirname,
				`../uploads/images/avatars/`,
				image.name
			);

			const data = {
				...avatar,
				url:
					process.env.URL_FILE +
					`/uploads/images/avatars/` +
					image.name,
			};

			res.status(200).json({
				ok: true,
				message: "Imagen de perfil cambiada correctamente",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				ok: false,
				message: "Error al cambiar la imagen de perfil",
			});
		}
	}

	try {
		const uploadPath = path.join(
			__dirname,
			`../uploads/images/avatars/`,
			image.name
		);

		const data = {
			id: uuidv4(),
			userId: uid,
			type: 6,
			url: process.env.URL_FILE + `/uploads/images/avatars/` + image.name,
		};

		image.mv(uploadPath, (err) => {
			if (err) {
				console.log(err);
			}

			const document = new Document(data);
			document.save();

			res.status(200).json({
				ok: true,
				document,
			});
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al cambiar la imagen",
		});
	}
};

module.exports = {
	createUser,
	getUsersInactive,
	getUserInactive,
	setApproveUser,
	setRejectUser,
	getUsers,
	ChangePassword,
	changeAvatar,
};
