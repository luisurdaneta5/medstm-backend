const db = require("./db");
const { DataTypes } = require("sequelize");

const User = db.sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.STRING(255),
			primaryKey: true,
		},
		type: {
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING(255),
		},
		lastname: {
			type: DataTypes.STRING(255),
		},
		email: {
			type: DataTypes.STRING(255),
		},
		password: {
			type: DataTypes.STRING(255),
		},
		phone: {
			type: DataTypes.STRING(255),
		},
		country: {
			type: DataTypes.STRING(255),
		},
		country_code: {
			type: DataTypes.STRING(5),
		},
		province: {
			type: DataTypes.STRING(255),
		},
		city: {
			type: DataTypes.STRING(255),
		},
		status: {
			type: DataTypes.INTEGER,
		},
		plan: {
			type: DataTypes.STRING(255),
		},
		date_venciment: {
			type: DataTypes.DATE(),
		},
	}
	// { timestamps: false }
);

module.exports = User;
