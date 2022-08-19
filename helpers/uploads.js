const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Document = require("../models/documents");

const uploads = (req, res, file, data, location) => {
	const name_short = file.name.split(".");
	const extension = name_short[name_short.length - 1];

	const temporalName = uuidv4() + "." + extension;

	const uploadPath = path.join(
		__dirname,
		`../uploads/documents/`,
		temporalName
	);

	const newData = {
		...data,
		url: process.env.URL_FILE + `/uploads/documents/` + temporalName,
	};

	file.mv(uploadPath, (err) => {
		if (err) {
			console.log(err);
		}

		const document = new Document(newData);
		document.save();

		console.log(`"File uploaded to " + ${uploadPath}`);
	});
};

module.exports = uploads;
