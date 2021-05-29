import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run(button: any) {
		console.log(button);
	}
}
