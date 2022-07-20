const path = require("path");
const Document = require("../models/documents");

const uploads = (req, res, file, data, location) => {
	const uploadPath = path.join(
		__dirname,
		`../uploads/${location}/`,
		file.name
	);

	const newData = {
		...data,
		url: process.env.URL_FILE + `/uploads/${location}/` + file.name,
	};

	file.mv(uploadPath, (err) => {
		if (err) {
			console.log(err);
		}

		const document = new Document(newData);
		document.save();
		// req.getConnection((err, connection) => {
		// 	if (err) return console.log(err);

		// 	connection.query(
		// 		"INSERT INTO documents SET ?",
		// 		[newData],
		// 		(err, result) => {
		// 			if (err) {
		// 				console.log(err);
		// 			}

		// 			console.log("Registrado en Base de Datos");
		// 		}
		// 	);
		// });

		console.log(`"File uploaded to " + ${uploadPath}`);
	});
};

module.exports = uploads;
