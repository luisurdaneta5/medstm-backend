const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const { generarJWT } = require("../helpers/jwt");

const setLogin = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({
			attributes: {
				exclude: [
					"phone",
					"country",
					"country_code",
					"province",
					"city",
					"status",
					"plan",
					"createdAt",
					"updatedAt",
				],
			},
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).json({
				ok: false,
				message: "Este usuario no existe",
			});
		}

		const validPassword = await bcrypt.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				message: "Contraseña incorrecta",
			});
		}

		const token = await generarJWT(user.id, user.name, user.type);

		return res.status(200).json({
			ok: true,
			id: user.id,
			name: user.name + " " + user.lastname,
			type: user.type,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener los usuarios",
		});
	}
};

const revalidarToken = async (req, res = response) => {
	const uid = req.uid;
	const name = req.name;
	const type = req.type;

	const token = await generarJWT(uid, name, type);

	res.status(200).json({
		ok: true,
		uid,
		name,
		type,
		token,
	});
};

module.exports = {
	setLogin,
	revalidarToken,
};
