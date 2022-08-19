const { DataTypes } = require("sequelize");
const db = require("./db");

const mySpecialities = db.sequelize.define("my_specialities", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	speciality: {
		type: DataTypes.STRING(255),
	},
});

module.exports = mySpecialities;
