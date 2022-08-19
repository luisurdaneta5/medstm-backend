const { DataTypes } = require("sequelize");
const db = require("./db");

const Withdrawal = db.sequelize.define("withdrawals", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	wallet: {
		type: DataTypes.STRING(255),
	},
	amount: {
		type: DataTypes.FLOAT,
	},
});

module.exports = Withdrawal;
