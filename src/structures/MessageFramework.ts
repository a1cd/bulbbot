export class MessageFramework {
	options: {};

	constructor(options: any = {}) {
		this.options = options;
	}

	sendMsg(input: string) {
		//@ts-ignore
		if (this.options.listener) {
			//@ts-ignore
			let listener = this.options.listener;
			listener.channel.send(input).catch((err: any) => {
				return err;
			});
			//@ts-ignore
		} else if (!this.options.listener) throw new Error("Missing an event listener");
		else if (!input) throw new Error("Missing input");
	}

	sendBtn(client: any, content: string, buttons: any[]) {
		//@ts-ignore
		let listener = this.options.listener;

		client.api.channels(listener.channel.id).messages.post({
			data: {
				content,
				components: [
					{
						type: 1,
						components: buttons,
					},
				],
			},
		});
	}
}
