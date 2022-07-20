const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { sequelize } = require("./models/db");
const { logger } = require("./helpers");
const fileUpload = require("express-fileupload");
require("./models/asociations");
require("dotenv").config();

dotenv.config();

const app = express();

//Middlewares
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		parameterLimit: "50000",
		extended: true,
	})
);
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

//Routes
// app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/users"));
app.use("/api", require("./routes/ui"));

app.listen(process.env.PORT, () => {
	//Servidor
	console.log(`Server started on port ${process.env.PORT}`);

	sequelize
		.authenticate()
		.then(() => {
			console.log(
				"Connection to Database has been established successfully."
			);
		})
		.catch((err) => {
			console.error("Unable to connect to the database:", err);
		});
});