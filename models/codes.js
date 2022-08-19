const { DataTypes } = require("sequelize");
const db = require("./db");

const Code = db.sequelize.define("codes", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	code: {
		type: DataTypes.STRING(255),
	},
});

module.exports = Code;
