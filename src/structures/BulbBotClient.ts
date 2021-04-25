import { Client, Collection, Permissions } from "discord.js";
import ClientException from "./exceptions/ClientException";
import Event from "./Event";
import Util from "./Util";
import Command from "./Command";
import BulbBotUtils from "../utils/BulbBotUtils";

export default class extends Client {
	public prefix: string = "";
	public commands: Collection<string, Command>;
	public aliases: Collection<string, string>;
	public events: Collection<string, Event>;
	public defaultPerms;
	private utils;
	public bulbutils: BulbBotUtils;
	public userClearance: number = 0;

	constructor(options: any) {
		super({
			disableMentions: "everyone",
			fetchAllMembers: false,
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);
		this.bulbutils = new BulbBotUtils();
	}

	validate(options: any): void {
		if (typeof options !== "object") throw new ClientException("Options must be type of Object!");

		if (!options.token) throw new ClientException("Client cannot log in without token!");
		this.token = options.token;

		if (!options.prefix) throw new ClientException("Client cannot log in without prefix!");
		this.prefix = options.prefix;

		if (!options.defaultPerms) throw new ClientException("Default permissions cannot be null!");
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	async login(token = this.token): Promise<any> {
		await this.utils.loadEvents();
		await this.utils.loadCommands();
		await super.login(<string>token);
	}
}