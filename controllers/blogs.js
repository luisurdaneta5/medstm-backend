const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Notice = require("../models/notices");

const CreateNotice = async (req, res = response) => {
	const { body } = req;
	const image = req.files.image;

	try {
		const uploadPath = path.join(
			__dirname,
			`../uploads/images/blog/`,
			image.name
		);

		const data = {
			...body,
			id: uuidv4(),
			image: process.env.URL_FILE + `/uploads/images/blog/` + image.name,
		};

		image.mv(uploadPath, (err) => {
			if (err) {
				console.log(err);
			}

			const notice = new Notice(data);
			notice.save();

			res.status(200).json({
				ok: true,
				message: "Noticia publicada Correctamente",
			});
			console.log(`"File uploaded to " + ${uploadPath}`);
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al crear la noticia",
		});
	}
};

const getNotices = async (req, res = response) => {
	try {
		const notices = await Notice.findAll();

		res.status(200).json({
			ok: true,
			notices,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener las noticias",
		});
	}
};

const getNotice = async (req, res = response) => {
	try {
		const notice = await Notice.findOne({
			where: {
				id: req.query.id,
			},
		});

		return res.status(200).json({
			ok: true,
			notice,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al obtener la noticia",
		});
	}
};

const UpdateNotice = async (req, res = response) => {
	const { body } = req;

	try {
		const notice = await Notice.findOne({
			where: {
				id: body.id,
			},
		});

		if (req.files !== null && notice) {
			const image = req.files.image;
			const uploadPath = path.join(
				__dirname,
				`../uploads/images/blog/`,
				image.name
			);

			const data = {
				...body,
				image:
					process.env.URL_FILE + `/uploads/images/blog/` + image.name,
			};

			image.mv(uploadPath, (err) => {
				if (err) {
					console.log(err);
				}

				notice.update(data);
			});
		} else {
			notice.update(body);
		}

		res.status(200).json({
			ok: true,
			message: "Noticia publicada Correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al actualizar la noticia",
		});
	}
};

const DeleteNotice = async (req, res = response) => {
	const { id } = req.query;

	try {
		const notice = await Notice.findOne({
			where: {
				id,
			},
		});

		notice.destroy();

		res.status(200).json({
			ok: true,
			message: "Noticia eliminada Correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			message: "Error al eliminar la noticia",
		});
	}
};

module.exports = {
	CreateNotice,
	getNotices,
	getNotice,
	UpdateNotice,
	DeleteNotice,
};
