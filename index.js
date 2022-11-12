const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { sequelize } = require("./models/db");
const path = require("path");

const fileUpload = require("express-fileupload");
require("./models/asociations");
require("dotenv").config();

dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		parameterLimit: "50000",
		extended: true,
	})
);
app.use(bodyParser.json());

app.use(express.static("public"));

//acceso a documentos
app.use(
	"/uploads/documents",
	express.static(path.join(__dirname, "/uploads/documents"))
);

//acceso a avatars
app.use(
	"/uploads/avatars",
	express.static(path.join(__dirname, "/uploads/images/avatars"))
);

//acceso a blogs
app.use(
	"/uploads/blog",
	express.static(path.join(__dirname, "/uploads/images/blog"))
);

//acceso a specialities
app.use(
	"/uploads/specialities",
	express.static(path.join(__dirname, "/uploads/images/specialities"))
);

app.use(express.json());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

//Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/users"));
app.use("/api", require("./routes/ui"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/specialities", require("./routes/specialities"));
app.use("/api/address", require("./routes/addresses"));
app.use("/api/social", require("./routes/socialNetwork"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/withdrawals", require("./routes/withdrawals"));

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
