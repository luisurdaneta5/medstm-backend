const User = require("./users");
const Referral = require("./referrals");
const Document = require("./documents");

User.hasMany(Referral, {
	foreignKey: "userId",
});

Referral.belongsTo(User, {
	foreignKey: "referId",
});

User.hasMany(Document, {
	foreignKey: "userId",
});
