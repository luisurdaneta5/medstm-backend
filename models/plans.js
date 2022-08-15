const { DataTypes } = require("sequelize");
const db = require("./db");

const Plan = db.sequelize.define(
	"plans",
	{
		id: {
			type: DataTypes.STRING(255),
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(255),
		},
		price_promotor: {
			type: DataTypes.FLOAT,
		},
		price_professional: {
			type: DataTypes.FLOAT,
		},
		percentage_promotor: {
			type: DataTypes.FLOAT,
		},
		percentage_professional: {
			type: DataTypes.FLOAT,
		},
		color: {
			type: DataTypes.STRING(100),
		},
	},
	{ timestamps: false }
);

module.exports = Plan;
