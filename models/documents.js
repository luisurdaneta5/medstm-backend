const { DataTypes } = require("sequelize");
const db = require("./db");

const Document = db.sequelize.define("documents", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	type: {
		type: DataTypes.INTEGER,
	},
	url: {
		type: DataTypes.STRING(255),
	},
});

module.exports = Document;
