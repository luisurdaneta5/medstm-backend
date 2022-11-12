const { DataTypes } = require("sequelize");
const db = require("./db");

const Payment = db.sequelize.define("payments", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	binanceUser: {
		type: DataTypes.STRING(255),
	},
	transactionId: {
		type: DataTypes.STRING(255),
	},
	paymentDate: {
		type: DataTypes.DATE,
	},
	amount: {
		type: DataTypes.FLOAT,
	},
	plan: {
		type: DataTypes.STRING(60),
	},
	status: {
		type: DataTypes.INTEGER,
	},
});

module.exports = Payment;
