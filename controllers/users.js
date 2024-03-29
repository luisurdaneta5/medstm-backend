const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const uploads = require("../helpers/uploads");
const Document = require("../models/documents");
const Referral = require("../models/referrals");
const path = require("path");
const User = require("../models/users");
const Withdrawal = require("../models/withdrawals");
const Address = require("../models/addresses");
const mySpecialities = require("../models/mySpecialities");
const Code = require("../models/codes");
const random = require("string-random");
const Balance = require("../models/balances");
const socialNetwork = require("../models/socialNetwork");
const { exit } = require("process");

const createUser = async (req, res = response) => {
	const body = req.body;

	let referralCode = random();

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
			//Asignar el referido
			if (body.code != "") {
				const codeUser = await Code.findOne({
					where: {
						code: body.code,
					},
				});

				if (!codeUser) {
					res.status(500).json({
						ok: false,
						message: "Codigo Referido Invalido",
					});
				} else {
					try {
						user = new User(data);

						//Genera un codigo de referido
						const referralData = {
							id: uuidv4(),
							userId: user.id,
							code: referralCode,
						};

						const new_code = new Code(referralData);
						await new_code.save();

						//Subida de archivos
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

							uploads(req, res, req.files.file1, cv);
							uploads(req, res, req.files.file2, degree);
						}

						await user.save();

						const dataCode = {
							id: uuidv4(),
							userId: codeUser.userId,
							referId: user.id,
						};

						const referral = new Referral(dataCode);
						referral.save();

						res.status(200).json({
							ok: true,
							message: "Solicitud enviada correctamente",
						});
					} catch (error) {
						res.status(500).json({
							ok: false,
							message: "Error al crear el usuario",
						});
					}
				}
			} else {
				user = new User(data);

				//Genera un codigo de referido
				const referralData = {
					id: uuidv4(),
					userId: user.id,
					code: referralCode,
				};

				const new_code = new Code(referralData);
				await new_code.save();

				//Subida de archivos
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

					uploads(req, res, req.files.file1, cv);
					uploads(req, res, req.files.file2, degree);
				}

				await user.save();

				res.status(200).json({
					ok: true,
					message: "Solicitud enviada correctamente",
				});
			}
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
								exclude: ["city", "country", "country_code", "email", "password", "phone", "province", "status", "type"],
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

	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

		const data = {
			id: uuidv4(),
			userId: id,
			facebook: "",
			instagram: "",
			twitter: "",
			linkedin: "",
		};

		const balance = {
			id: uuidv4(),
			userId: id,
			balance: 0,
		};

		const avatar = {
			id: uuidv4(),
			userId: id,
			type: 6,
			url: "",
		};

		const createBalance = new Balance(balance);
		const socialNetwork = new socialNetwork(data);
		const createAvatar = new Document(avatar);

		createBalance.save();
		socialNetwork.save();
		createAvatar.save();

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
			where: {
				type: type,
				status: [1, 0],
			},
			include: [
				{
					model: Document,
					attributes: {
						exclude: ["userId", "createdAt", "updatedAt"],
					},
				},
			],
			attributes: {
				exclude: ["email", "password", "phone", "country", "province", "city", "country_code"],
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
	const { id, newPassword, oldPassword } = req.body;
	console.log("DATOS:", req.body);
	try {
		const user = await User.findOne({
			where: {
				id,
			},
		});

		const validPassword = bcrypt.compareSync(oldPassword, user.password);

		if (validPassword) {
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(newPassword, salt);
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
				message: "Su contraseña ha sido actualizada correctamente",
			});
		} else {
			res.status(500).json({
				ok: false,
				message: "Contraseña actual no coincide",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const changeAvatar = async (req, res = response) => {
	const { uid, id } = req.body;
	const { image } = req.files;

	const name_short = image.name.split(".");
	const extension = name_short[name_short.length - 1];

	const extensionsValids = ["png", "jpg", "jpeg", "gif"];

	if (!extensionsValids.includes(extension)) {
		res.status(400).json({
			message: "Imagen no válida",
		});
	}

	const temporalName = uuidv4() + "." + extension;

	if (id) {
		try {
			const uploadPath = path.join(__dirname, `../uploads/images/avatars/`, temporalName);

			image.mv(uploadPath, (err) => {
				if (err) {
					console.log(err);
				}

				Document.findOne(
					{
						url: process.env.URL_FILE + `/uploads/images/avatars/` + temporalName,
					},
					{
						where: {
							id,
						},
					}
				);

				res.status(200).json({
					ok: true,
				});
			});

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
	} else {
		try {
			const uploadPath = path.join(__dirname, `../uploads/images/avatars/`, temporalName);

			const data = {
				id: uuidv4(),
				userId: uid,
				type: 6,
				url: process.env.URL_FILE + `/uploads/avatars/` + temporalName,
			};

			image.mv(uploadPath, (err) => {
				if (err) {
					console.log(err);
				}

				const document = new Document(data);
				document.save();

				res.status(200).json({
					ok: true,
				});
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				ok: false,
				message: "Error al cambiar la imagen",
			});
		}
	}
};

const getUserforProfile = async (req, res = response) => {
	const { id } = req.query;
	try {
		const user = await User.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ["id", "updatedAt", "password"],
			},
			include: [
				{
					model: Balance,
					attributes: {
						exclude: ["id", "userId", "createdAt", "updatedAt"],
					},
				},
				{
					model: Code,
					attributes: {
						exclude: ["id", "userId", "createdAt", "updatedAt"],
					},
				},
				{
					model: Withdrawal,
					attributes: {
						exclude: ["updatedAt"],
					},
				},
				{
					model: mySpecialities,
					attributes: {
						exclude: ["userId", "createdAt", "updatedAt"],
					},
				},
				{
					model: Address,
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
				{
					model: Referral,

					attributes: {
						exclude: ["referId", "userId", "createdAt", "updatedAt"],
					},
					include: [
						{
							model: User,
							attributes: {
								exclude: ["city", "country", "country_code", "email", "password", "phone", "province", "status", "type"],
							},
							where: {
								status: 1,
							},
						},
					],
				},
			],
		});

		const avatar = await Document.findOne({
			where: {
				userId: id,
				type: 6,
			},
			attributes: {
				exclude: ["userId", "type", "createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			user,
			avatar,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener el usuario",
		});
	}
};

const changeName = async (req, res = response) => {
	const { id, name, lastname } = req.body;

	try {
		const user = await User.findOne({
			where: {
				id,
			},
		});

		user.update({
			name,
			lastname,
		});

		res.status(200).json({
			ok: true,
			message: "Actualizacion exitosa",
		});
	} catch (error) {}
};

const changePhone = async (req, res = response) => {
	const { id, phone } = req.body;

	try {
		const user = await User.findOne({
			where: {
				id,
			},
		});

		user.update({
			phone,
		});

		res.status(200).json({
			ok: true,
			message: "Actualizacion exitosa",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al actualizar",
		});
	}
};

const changeEmail = async (req, res = response) => {
	const { id, email } = req.body;

	try {
		const findEmail = await User.findOne({
			where: {
				email,
			},
		});

		console.log(findEmail);
		if (findEmail) {
			res.status(500).json({
				ok: false,
				message: "Este correo ya esta registrado, porfavor intente con otro",
			});
		} else {
			const user = await User.findOne({
				where: {
					id,
				},
			});

			user.update({
				email,
			});

			res.status(200).json({
				ok: true,
				message: "Actualizacion exitosa",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//Dashboard
const createUserAdmin = async (req, res = response) => {
	const body = req.body;
	const { avatar } = req.files;

	console.log(body);

	try {
		let user = await User.findOne({
			where: {
				email: body.email,
			},
		});
		if (user) {
			res.status(500).json({
				ok: false,
				message: "Ya existe usuario con este correo electronico",
			});
		} else {
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(body.password, salt);
			user = new User({
				...body,
				plan: "Gratis",
				password: hash,
				status: 1,
				id: uuidv4(),
			});
			await user.save();
			const name_short = avatar.name.split(".");
			const extension = name_short[name_short.length - 1];
			const extensionsValids = ["png", "jpg", "jpeg", "gif"];
			if (!extensionsValids.includes(extension)) {
				res.status(400).json({
					message: "Imagen no válida",
				});
			}
			const temporalName = uuidv4() + "." + extension;
			const uploadPath = path.join(__dirname, `../uploads/images/avatars/`, temporalName);
			const data = {
				id: uuidv4(),
				userId: user.id,
				type: 6,
				url: process.env.URL_FILE + `/uploads/avatars/` + temporalName,
			};
			avatar.mv(uploadPath, (err) => {
				if (err) {
					console.log(err);
				}
				const document = new Document(data);
				document.save();
			});
			res.status(200).json({
				ok: true,
				message: "Usuario creado exitosamente",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const getUserForEdit = async (req, res = response) => {
	const { id } = req.query;
	console.log(id);

	try {
		const user = await User.findOne({
			where: {
				id: id,
			},
			attributes: {
				exclude: ["password", "status", "plan", "createdAt", "updatedAt"],
			},
			include: {
				model: Document,

				where: {
					userId: id,
					type: 6,
				},
				attributes: {
					exclude: ["userId", "type", "createdAt", "updatedAt"],
				},
			},
		});

		res.status(200).json({
			ok: true,
			user,
		});
	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (req, res = response) => {
	const body = req.body;
	const avatar = req.files;

	try {
		const user = await User.findOne({
			where: {
				id: body.id,
			},
		});

		if (body.password) {
			const salt = bcrypt.genSaltSync();

			const data = {
				name: body.name,
				lastname: body.lastname,
				phone: body.phone,
				email: body.email,
				country: body.country,
				country_code: body.country_code,
				province: body.province,
				city: body.city,
				password: bcrypt.hashSync(body.password, salt),
			};
			user.update(data);
		} else {
			const data = {
				name: body.name,
				lastname: body.lastname,
				phone: body.phone,
				email: body.email,
				country: body.country,
				country_code: body.country_code,
				province: body.province,
				city: body.city,
			};
			user.update(data);
		}

		if (avatar) {
			const found = await Document.findOne({
				where: {
					id: body.avatar_id,
				},
			});

			if (found) {
				const name_short = avatar.avatar.name.split(".");

				const extension = name_short[name_short.length - 1];

				const extensionsValids = ["png", "jpg", "jpeg", "gif"];

				if (!extensionsValids.includes(extension)) {
					res.status(400).json({
						message: "Imagen no válida",
					});
				}

				const temporalName = uuidv4() + "." + extension;

				const uploadPath = path.join(__dirname, `../uploads/images/avatars/`, temporalName);

				avatar.avatar.mv(uploadPath, (err) => {
					if (err) {
						console.log(err);
					}

					found.update({
						url: process.env.URL_FILE + `/uploads/avatars/` + temporalName,
					});

					res.status(200).json({
						ok: true,
					});
				});
			} else {
				const uploadPath = path.join(__dirname, `../uploads/images/avatars/`, temporalName);

				const data = {
					id: uuidv4(),
					userId: user.id,
					type: 6,
					url: process.env.URL_FILE + `/uploads/avatars/` + temporalName,
				};

				avatar.mv(uploadPath, (err) => {
					if (err) {
						console.log(err);
					}

					const document = new Document(data);
					document.save();

					res.status(200).json({
						ok: true,
					});
				});
			}
		}

		res.status(200).json({
			ok: true,
			message: "Usuario Actualizado correctamente",
		});
	} catch (error) {
		console.log(error);
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
	getUserforProfile,
	changeName,
	changePhone,
	changeEmail,
	createUserAdmin,
	getUserForEdit,
	updateUser,
};
