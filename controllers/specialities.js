const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Speciality = require("../models/specialities");
const Notice = require("../models/notices");

const CreateSpeciality = async (req, res = response) => {
	const { body } = req;
	const image = req.files.img;

	try {
		const uploadPath = path.join(
			__dirname,
			`../uploads/images/specialities/`,
			image.name
		);

		const data = {
			...body,
			id: uuidv4(),
			img:
				process.env.URL_FILE +
				`/uploads/images/specialities/` +
				image.name,
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
			console.log("paso por subir imagen");
			const image = req.files.img;

			const uploadPath = path.join(
				__dirname,
				`../uploads/images/specialities/`,
				image.name
			);

			const data = {
				...body,
				img:
					process.env.URL_FILE +
					`/uploads/images/specialities/` +
					image.name,
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
module.exports = {
	CreateSpeciality,
	getSpecialities,
	getSpeciality,
	UpdateSpeciality,
	DeleteSpeciality,
};
