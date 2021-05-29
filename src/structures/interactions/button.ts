const styles = {
	blurple: 1,
	gray: 2,
	green: 3,
	red: 4,
	gray_url: 5,
};

function resolveStyle(style: string) {
	if (!style || style === undefined || style === null) throw new TypeError("NO_BUTTON_STYLE: Please provide button style");
	if (!styles[style] || styles[style] === undefined || styles[style] === null) throw new TypeError("INVALID_BUTTON_STYLE: An invalid button styles was provided");

	return styles[style] || style;
}

export default class MessageButton {
	type: number | undefined;
	style: number | undefined;
	label?: string | null;
	emoji?: string;
	custom_id?: string | null;
	url?: string | null;
	disabled?: boolean;

	constructor(data = {}) {
		this.main(data);
	}

	main(data: any) {
		if (data.style && data.style == "gray") data.style = "grey";
		this.style = "style" in data ? resolveStyle(data.style) : null;

		this.type = 2;
		this.label = "label" in data ? data.label : null;
		this.disabled = "disabled" in data ? Boolean(data.disabled) : false;

		if (this.style === 5) this.url = "url" in data ? data.url : null;
		else this.custom_id = "id" in data ? data.id : null;

		//this.emoji = "";

		return this;
	}

	setStyle(style: string) {
		this.style = resolveStyle(style);
		return this;
	}

	setLabel(label: string) {
		this.label = label;
		return this;
	}

	setDisabled(boolean: boolean = true) {
		this.disabled = boolean;
		return this;
	}

	setURL(url: string) {
		this.url = this.style === 5 ? url : null;
		return this;
	}

	setId(id: string) {
		this.custom_id = this.style === 5 ? null : id;
		return this;
	}

	toJSON() {
		return {
			type: 2,
			style: this.style,
			label: this.label,
			disabled: this.disabled,
			url: this.url,
			custom_id: this.custom_id,
		};
	}
}
