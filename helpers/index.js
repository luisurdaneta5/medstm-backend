const bunyan = require("bunyan");
// import uuid from "uuid/v4";

// /**
//  *
//  * @param isUpdate nos dice si es una insercion o actualizacion del registro
//  */
// export const defValues = (isUpdate) => {
// 	const date = new Date();
// 	return !isUpdate
// 		? {
// 				id: uuid(),
// 				createdAt: date,
// 				updatedAt: date,
// 				createdUsu: "",
// 				updatedUsu: "",
// 		  }
// 		: {
// 				updatedAt: date,
// 		  };
// };

// export const excludeDef = () => {
// 	return ["createdAt", "updatedAt", "createdUsu", "updatedUsu"];
// };

const logger = bunyan.createLogger({
	name: "logger",
	src: true,
	serializers: {
		err: bunyan.stdSerializers.err,
	},
});

module.exports = {
	logger,
};
