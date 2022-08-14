const { DataTypes } = require("sequelize");
const db = require("./db");

const Speciality = db.sequelize.define("Specialities", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(255),
	},
	img: {
		type: DataTypes.TEXT,
	},
});

module.exports = Speciality;
