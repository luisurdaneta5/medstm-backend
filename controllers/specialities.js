const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Speciality = require("../models/specialities");
const Notice = require("../models/notices");
const mySpecialities = require("../models/mySpecialities");

const CreateSpeciality = async (req, res = response) => {
	const { body } = req;
	const image = req.files.img;

	const name_short = image.name.split(".");
	const extension = name_short[name_short.length - 1];

	const temporalName = uuidv4() + "." + extension;

	try {
		const uploadPath = path.join(
			__dirname,
			`../uploads/images/specialities/`,
			temporalName
		);

		const data = {
			...body,
			id: uuidv4(),
			img: process.env.URL_FILE + `/uploads/specialities` + temporalName,
		};

		image.mv(uploadPath, (err) => {
			if (err) {
				console.log(err);
			}

			const speciality = new Speciality(data);
			speciality.save();

			res.status(200).json({
				ok: true,
				message: "Especialidad publicada Correctamente",
			});
			console.log(`"File uploaded to " + ${uploadPath}`);
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al crear la especialidad",
		});
	}
};

const getSpecialities = async (req, res = response) => {
	try {
		const specialities = await Speciality.findAll();
		res.status(200).json({
			ok: true,
			specialities,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener las especialidades",
		});
	}
};

const getSpeciality = async (req, res = response) => {
	const { id } = req.query;

	try {
		const speciality = await Speciality.findOne({
			where: {
				id: id,
			},
		});

		return res.status(200).json({
			ok: true,
			speciality,
		});
	} catch (error) {
		console.log(error);
	}
};

const UpdateSpeciality = async (req, res = response) => {
	const { body } = req;

	try {
		const speciality = await Speciality.findOne({
			where: {
				id: body.id,
			},
		});

		if (req.files !== null && speciality) {
			const image = req.files.img;
			const name_short = image.name.split(".");
			const extension = name_short[name_short.length - 1];

			const temporalName = uuidv4() + "." + extension;

			const uploadPath = path.join(
				__dirname,
				`../uploads/images/specialities/`,
				temporalName
			);

			const data = {
				...body,
				img:
					process.env.URL_FILE +
					`/uploads/specialities` +
					temporalName,
			};

			image.mv(uploadPath, (err) => {
				if (err) {
					console.log(err);
				}

				speciality.update(data);
			});
		} else {
			console.log("paso por no subir imagen s");
			speciality.update(body);
		}

		res.status(200).json({
			ok: true,
			message: "Especialidad actualizada",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al actualizar la noticia",
		});
	}
};

const DeleteSpeciality = async (req, res = response) => {
	const { id } = req.query;
	try {
		const speciality = await Speciality.findOne({
			where: {
				id,
			},
		});

		speciality.destroy();

		res.status(200).json({
			ok: true,
			message: "Especialidad eliminada correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al eliminar la especialidad",
		});
	}
};

const setSpecialityUser = async (req, res = response) => {
	const { uid, speciality } = req.body;

	try {
		const data = {
			id: uuidv4(),
			userId: uid,
			speciality: speciality,
		};

		const found = await mySpecialities.findOne({
			where: {
				userId: uid,
				speciality: speciality,
			},
		});

		if (found) {
			res.status(500).json({
				ok: false,
				message: "Ya tiene agregada esta especialidad",
			});
		} else {
			const specialityData = new mySpecialities(data);
			specialityData.save();

			res.status(200).json({
				ok: true,
				message: "Especialidad asignada correctamente",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al asignar la especialidad",
		});
	}
};
module.exports = {
	CreateSpeciality,
	getSpecialities,
	getSpeciality,
	UpdateSpeciality,
	DeleteSpeciality,
	setSpecialityUser,
};
