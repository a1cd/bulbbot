import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run(interaction: any) {
		if (!interaction.message) return;
		if (interaction.data.component_type === 2) this.client.emit("clickButton", interaction);
	}
}
