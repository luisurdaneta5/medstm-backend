const { DataTypes } = require("sequelize");
const db = require("./db");

const Address = db.sequelize.define("addresses", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	address: {
		type: DataTypes.STRING(255),
	},
});

module.exports = Address;
