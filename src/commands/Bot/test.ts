import Command from "../../structures/Command";
import { Message } from "discord.js";
import { MessageFramework } from "../../structures/MessageFramework";
import MessageButton from "../../structures/interactions/button";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns some useful information about the bot",
			category: "Bot",
			aliases: ["bot"],
			usage: "!about",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const frame = new MessageFramework({ listener: message });
		const btn = new MessageButton().setLabel("hi").setStyle("red").setID("hi");
		const btn2 = new MessageButton().setLabel("hi").setStyle("red").setID("hi");

		frame.sendBtn(this.client, "hi", [btn, btn2]);
	}
}
