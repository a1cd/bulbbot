const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(member) {
		// TODO
		console.log("removed guild member:", member);
	}
};
