const { DataTypes } = require("sequelize");
const db = require("./db");

const Notice = db.sequelize.define("Notices", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING(255),
	},
	content: {
		type: DataTypes.TEXT,
	},
	editor: {
		type: DataTypes.TEXT,
	},
	image: {
		type: DataTypes.STRING(255),
	},
});

module.exports = Notice;
