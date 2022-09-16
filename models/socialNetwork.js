const { DataTypes } = require("sequelize");
const db = require("./db");

const socialNetwork = db.sequelize.define("social_network", {
	id: {
		type: DataTypes.STRING(255),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(255),
	},
	facebook: {
		type: DataTypes.STRING(255),
	},
	instagram: {
		type: DataTypes.STRING(255),
	},
	twitter: {
		type: DataTypes.STRING(255),
	},
	linkedin: {
		type: DataTypes.STRING(255),
	},
});

module.exports = socialNetwork;
