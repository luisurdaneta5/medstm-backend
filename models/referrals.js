const { DataTypes } = require("sequelize");
const User = require("./users");
const db = require("./db");

const Referral = db.sequelize.define(
	"referrals",
	{
		id: {
			type: DataTypes.STRING(255),
			primaryKey: true,
		},
		referId: {
			type: DataTypes.STRING(255),
		},
		userId: {
			type: DataTypes.STRING(255),
		},
	},
	{ timestamps: false }
);

module.exports = Referral;
