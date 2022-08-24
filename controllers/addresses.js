const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const Address = require("../models/addresses");

const setAddress = (req, res = response) => {
	const { userId, address } = req.body;

	const data = {
		id: uuidv4(),
		userId: userId,
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

	console.log("UserID:", userId);
	console.log("Direccion:", address);
};

module.exports = {
	setAddress,
};
