const sequelize = require("./database/connection");
const { Op } = require("sequelize");

const { SendModAction, SendModActionTemp, SendAutoUnban } = require("./moderation/log");

module.exports = class InfractionsManager {
	/**
	 * Creates an infraction for the provided guild
	 *
	 * @param {Snowflake} guildId                 Guild ID where the Infraction is being stored in
	 * @param {string} action              		    Mod action type
	 * @param active             		    					false, true, Unix
	 * @param {string} reason             		    Reason specified by the responsible moderator
	 * @param {User.tag} target              		  User receiving the infraction
	 * @param {Snowflake} targetId            	  ID of the user receiving the infraction
	 * @param {User.tag} moderator             		Moderator responsible for the infraction
	 * @param {Snowflake} moderatorId           	ID of the responsible moderator
	 * @returns {Promise<number|*>} InfId         The ID of the created infraction
	 */
	async createInfraction(guildId, action, active, reason, target, targetId, moderator, moderatorId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
		});
		if (dbGuild === null) return;

		const inf = await sequelize.models.infraction.create({
			action,
			active,
			reason,
			target,
			targetId,
			moderator,
			moderatorId,
			guildId: dbGuild.id,
		});

		return inf.id;
	}

	/**
	 * Deletes an infraction for the provided guild
	 *
	 * @param {Snowflake} guildId       Guild ID where the infarction is being deleted
	 * @param infId         Infraction ID
	 * @returns {Promise<boolean>}
	 */
	async deleteInfraction(guildId, infId) {
		if (infId === "") return false;

		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						id: infId,
					},
				},
			],
		});
		if (dbGuild === null) return false;
		await dbGuild.infractions[0].destroy();

		return true;
	}

	/**
	 * Returns the selected infraction
	 *
	 * @param {Snowflake} guildId		Guild ID where the infraction is being stored
	 * @param infId			The unique ID of the infraction
	 * @returns {Promise<boolean>}	Returned infraction object
	 */
	async getInfraction(guildId, infId) {
		if (infId === "") return false;
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						id: infId,
					},
				},
			],
		});

		if (dbGuild === null) return false;
		return dbGuild.infractions[0];
	}

	/**
	 * Returns all Infractions stored for the specified guild
	 *
	 * @param {Snowflake} guildId           Guild ID
	 * @returns {Promise<string[]|*>}    Returned infraction array
	 */
	async getAllInfractions(guildId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.infraction }],
		});

		if (dbGuild === null) return null;

		return dbGuild.infractions.reverse();
	}

	/**
	 * Returns an object array of all Infraction for the searched user ID marked as offender
	 * in the database
	 *
	 * @param {Snowflake} guildId           Guild ID
	 * @param {Snowflake} offenderId        Searched user ID marked as offender in the database
	 * @returns {Promise<*[]|*>}    Returned infraction array
	 */
	async getOffenderInfractions(guildId, offenderId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						targetId: offenderId,
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	}

	/**
	 * Returns an object array of all Infractions for the specified user ID marked as Moderator
	 * in the database
	 *
	 * @param {Snowflake} guildId           Guild ID
	 * @param {Snowflake} moderatorId       Searched user ID marked as moderator in the database
	 * @returns {Promise<string[]|*>}    Returned infraction array
	 */
	async getModeratorInfractions(guildId, moderatorId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						moderatorId,
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	}

	/**
	 * Returns an array of Infractions where the specified user ID is either stored an Target ID or Moderator ID
	 *
	 * @param {Snowflake} guildId		ID of the guild where the Infractions are being stored
	 * @param {Snowflake} moderatorId	ID of the user being searched
	 * @param {Snowflake} targetId		ID of the user being searched
	 * @returns {Promise<string[]|*>}		Returned array of infractions
	 */
	async getAllUserInfractions(guildId, moderatorId, targetId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						[Op.or]: [{ moderatorId }, { targetId }],
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	}

	/**
	 * Returns the "active" value for the selected infraction
	 *
	 * @param {number} infId		Infraction ID
	 * @returns {Promise<boolean|number>}		Returned value, either a boolean or a Unix timestamp
	 */
	async getActive(infId) {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		return dbInf.active;
	}

	/**
	 * Sets the "active" column for the selected infraction to "active" in
	 * the database
	 *
	 * @param {number} infId		Infraction ID
	 * @param active	The active value, either a boolean or a Unix timestamp
	 * @returns {Promise<void>}
	 */
	async setActive(infId, active) {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.active = active;
		await dbInf.save();
	}

	/**
	 * Sets the moderator and moderatorId fields of the specified Infraction to the new specified user values
	 *
	 * @param infId		Unique ID of the selected Infraction
	 * @param {User} moderator		User object of the new Moderator
	 * @returns {Promise<boolean>}
	 */
	async setModerator(infId, moderator) {
		if (infId === "") return false;
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.moderator = moderator.username;
		dbInf.moderatorId = moderator.id;
		await dbInf.save();

		return true;
	}

	/**
	 * Sets the reason field of the specified Infraction to the new updated value
	 *
	 * @param {number} infId		Unique ID of the selected infraction
	 * @param {string} reason	New updated reason
	 * @returns {Promise<void>}
	 */
	async setReason(infId, reason) {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.reason = reason;
		await dbInf.save();
	}

	/**
	 * Returns the latest Mute infraction for the provided Guild and User
	 *
	 * @param {Snowflake} guildId		Selected Guild ID
	 * @param {Snowflake} offenderId	The selected User ID
	 * @returns {Promise<*[]|*>}		The latest Mute infraction stored in the database
	 */
	async getLatestMute(guildId, offenderId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						targetId: offenderId,
						action: "Mute",
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse()[0].id;
	}
};
