const User = require("./users");
const Referral = require("./referrals");
const Document = require("./documents");
const Withdrawal = require("./withdrawals");
const Address = require("./addresses");
const mySpecialities = require("./mySpecialities");
const Code = require("./codes");
const Balance = require("./balances");

User.hasMany(Referral, {
	foreignKey: "userId",
});

Referral.belongsTo(User, {
	foreignKey: "referId",
});

User.hasMany(Document, {
	foreignKey: "userId",
});

User.hasMany(Withdrawal, {
	foreignKey: "userId",
});

Withdrawal.belongsTo(User, {
	foreignKey: "userId",
});

User.hasMany(Address, {
	foreignKey: "userId",
});

Address.belongsTo(User, {
	foreignKey: "userId",
});

User.hasMany(mySpecialities, {
	foreignKey: "userId",
});

mySpecialities.belongsTo(User, {
	foreignKey: "userId",
});

User.hasOne(Code, {
	foreignKey: "userId",
});

Code.belongsTo(User, {
	foreignKey: "userId",
});

User.hasOne(Balance, {
	foreignKey: "userId",
});

Balance.belongsTo(User, {
	foreignKey: "userId",
});
