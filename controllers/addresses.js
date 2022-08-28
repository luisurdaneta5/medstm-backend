const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Address = require("../models/addresses");

const setAddress = (req, res = response) => {
	const { uid, address } = req.body;

	const data = {
		id: uuidv4(),
		userId: uid,
		address: address,
	};

	try {
		const address = new Address(data);
		address.save();

		res.status(200).json({
			ok: true,
			message: "Direccion agregada Correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al agrega la Direccion",
		});
	}
};

const getAddressUser = async (req, res = response) => {
	const { uid } = req.query;

	try {
		const addresses = await Address.findAll({
			where: {
				userId: uid,
			},
			attributes: {
				exclude: ["userId", "createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			addresses,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener tus direcciones",
		});
	}
};

const deleteAddress = async (req, res = response) => {
	const { id } = req.query;

	try {
		const address = await Address.findOne({
			where: {
				id,
			},
		});

		address.destroy();

		res.status(200).json({
			ok: true,
			message: "Direccion Eliminada",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
		});
	}
};

module.exports = {
	setAddress,
	getAddressUser,
	deleteAddress,
};
