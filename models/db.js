const path = require("path");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const conf = {
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	dialect: "mysql",
	operatorAliases: false,
};

const sequelize = new Sequelize(conf);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
