const { response } = require("express");
const { Op } = require("sequelize");
const Address = require("../models/addresses");
const Document = require("../models/documents");
const mySpecialities = require("../models/mySpecialities");
const socialNetwork = require("../models/socialNetwork");
const Speciality = require("../models/specialities");
const User = require("../models/users");

// 	const { arraySearch } = req.query;
// 	let results = [];
// 	const specialityKeys = [];
// 	const specialityWords = [];
// 	const locationWords = [];

// 	try {
// 		const specialities = await Speciality.findAll();

// 		for (const key in specialities) {
// 			if (Object.hasOwnProperty.call(specialities, key)) {
// 				const speciality = specialities[key];
// 				specialityKeys.push(speciality.code);
// 			}
// 		}

// 		for (const w in arraySearch) {
// 			const word = arraySearch[w];

// 			if (specialityKeys.includes(word.toLowerCase())) {
// 				specialityWords.push(word);
// 			} else {
// 				locationWords.push(word);
// 			}
// 		}

// 		if (locationWords.length > 0) {
// 			for (const l in locationWords) {
// 				if (Object.hasOwnProperty.call(locationWords, l)) {
// 					const word = locationWords[l];

// 					const users = await User.findAll({
// 						where: {
// 							status: 1,
// 							[Op.or]: [
// 								{
// 									country: {
// 										[Op.like]: arraySearch
// 									},
// 								},
// 								{
// 									province: {
// 										[Op.like]: "%" + word + "%",
// 									},
// 								},
// 								{
// 									city: {
// 										[Op.like]: "%" + word + "%",
// 									},
// 								},
// 							],
// 						},
// 						include: [
// 							{
// 								model: mySpecialities,
// 								as: "specialities",
// 								attributes: {
// 									exclude: ["id", "createdAt", "updatedAt", "userId"],
// 								},
// 							},
// 							{
// 								model: Address,
// 								attributes: {
// 									exclude: ["id", "createdAt", "updatedAt", "userId"],
// 								},
// 							},
// 							{
// 								model: socialNetwork,
// 								as: "rss",
// 								attributes: {
// 									exclude: ["id", "createdAt", "updatedAt", "userId"],
// 								},
// 							},
// 							{
// 								model: Document,
// 								where: {
// 									type: 6,
// 								},
// 								attributes: {
// 									exclude: ["id", "userId", "type", "createdAt", "updatedAt"],
// 								},
// 							},
// 						],
// 					});

// 					users.forEach((user) => {
// 						results.push(user);
// 					});

// 					if (specialityWords.length > 0) {
// 						results = [];
// 						specialityWords.forEach((w) => {
// 							users.forEach((u) => {
// 								u.specialities.forEach((s) => {
// 									if (s.speciality.toLowerCase() == w) {
// 										results.push(u);
// 									}
// 								});
// 							});
// 						});
// 					}
// 				}
// 			}
// 		}

// 		if (specialityWords.length > 0 && locationWords.length == 0) {
// 			results = [];
// 			const users = await User.findAll({
// 				where: {
// 					status: 1,
// 				},
// 				include: [
// 					{
// 						model: mySpecialities,
// 						as: "specialities",
// 						attributes: {
// 							exclude: ["id", "createdAt", "updatedAt", "userId"],
// 						},
// 					},
// 					{
// 						model: Address,
// 						attributes: {
// 							exclude: ["id", "createdAt", "updatedAt", "userId"],
// 						},
// 					},
// 					{
// 						model: socialNetwork,
// 						as: "rss",
// 						attributes: {
// 							exclude: ["id", "createdAt", "updatedAt", "userId"],
// 						},
// 					},
// 					{
// 						model: Document,
// 						where: {
// 							type: 6,
// 						},
// 						attributes: {
// 							exclude: ["id", "userId", "type", "createdAt", "updatedAt"],
// 						},
// 					},
// 				],
// 			});
// 			specialityWords.forEach((w) => {
// 				users.forEach((u) => {
// 					u.specialities.forEach((s) => {
// 						if (s.speciality.toLowerCase() == w) {
// 							results.push(u);
// 						}
// 					});
// 				});
// 			});
// 		}

// 		res.status(200).json({
// 			ok: true,
// 			count: results.length,
// 			results,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const getSearch = async (req, res = response) => {
	const { arraySearch, page, size } = req.query;

	console.log(arraySearch);
	try {
		if (arraySearch.length > 1) {
			const users = await User.findAndCountAll({
				include: [
					{
						model: mySpecialities,
						as: "specialities",
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
						right: false,
						required: false,
					},
					{
						model: Address,
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
					},
					{
						model: socialNetwork,
						as: "rss",
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
					},
					{
						model: Document,
						where: {
							type: 6,
						},
						attributes: {
							exclude: ["id", "userId", "type", "createdAt", "updatedAt"],
						},
					},
				],
				where: {
					status: 1,
					[Op.or]: [
						{
							[Op.and]: [
								{
									country: {
										[Op.in]: arraySearch,
									},

									city: {
										[Op.in]: arraySearch,
									},
								},
							],
						},
						{
							[Op.and]: [
								{
									country: {
										[Op.in]: arraySearch,
									},

									province: {
										[Op.in]: arraySearch,
									},
								},
							],
						},
						{
							[Op.and]: [
								{
									city: {
										[Op.in]: arraySearch,
									},

									province: {
										[Op.in]: arraySearch,
									},
								},
							],
						},
						{
							[Op.and]: [
								{
									country: {
										[Op.in]: arraySearch,
									},

									"$specialities.speciality$": {
										[Op.in]: arraySearch,
									},
								},
							],
						},
						{
							[Op.and]: [
								{
									province: {
										[Op.in]: arraySearch,
									},

									"$specialities.speciality$": {
										[Op.in]: arraySearch,
									},
								},
							],
						},
						{
							[Op.and]: [
								{
									city: {
										[Op.in]: arraySearch,
									},

									"$specialities.speciality$": {
										[Op.in]: arraySearch,
									},
								},
							],
						},
					],
				},
				limit: parseInt(size),
				offset: parseInt(page * size),
				subQuery: false,
			});
			res.status(200).json({
				ok: true,
				users,
			});
		} else {
			const users = await User.findAndCountAll({
				include: [
					{
						model: mySpecialities,
						as: "specialities",
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
						right: false,
						required: false,
					},
					{
						model: Address,
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
					},
					{
						model: socialNetwork,
						as: "rss",
						attributes: {
							exclude: ["id", "createdAt", "updatedAt", "userId"],
						},
					},
					{
						model: Document,
						where: {
							type: 6,
						},
						attributes: {
							exclude: ["id", "userId", "type", "createdAt", "updatedAt"],
						},
					},
				],
				where: {
					status: 1,
					[Op.or]: [
						{
							country: {
								[Op.in]: arraySearch,
							},
						},
						{
							province: {
								[Op.in]: arraySearch,
							},
						},
						{
							city: {
								[Op.in]: arraySearch,
							},
						},
						{
							"$specialities.speciality$": {
								[Op.in]: arraySearch,
							},
						},
					],
				},
				limit: parseInt(size),
				offset: parseInt(page * size),
				subQuery: false,
			});
			res.status(200).json({
				ok: true,
				users,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getSearch };
