const { DataTypes } = require("sequelize");
const db = require("./db");

const Balance = db.sequelize.define("balances", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	balance: {
		type: DataTypes.FLOAT,
	},
});

module.exports = Balance;
