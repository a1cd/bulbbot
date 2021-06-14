import winston from "winston";
import util from "util";
import chalk from "chalk";

const utilFormat = (enableColor: boolean) => {
	const printFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
	const format = winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), {
		transform: (info: any) => {
			const args = info[Symbol.for("splat")] || [];
			info.message = util.formatWithOptions({ colors: enableColor }, info.message, ...args);
			info.level = info.level.toUpperCase()[0];
			return info;
		},
	});
	return enableColor ? winston.format.combine(format, winston.format.colorize(), printFormat) : winston.format.combine(format, printFormat);
};

export const logger = winston.createLogger({
	level: "debug",

	transports: [
		new winston.transports.Console({
			format: utilFormat(true),
		}),
		new winston.transports.File({
			filename: "./logs/program.log",
			format: utilFormat(false),
		}),
	],
});

function fixMessage(string: any) {
	string = string.split("]");
	console.log(string);
}

console.log = (message: any, ...args: any) => logger.info(fixMessage(message), ...args);
console.info = (message: any, ...args: any) => logger.info("[INFO]", message, ...args);
console.warn = (message: any, ...args: any) => logger.warn("[WARN]", message, ...args);
console.error = (message: any, ...args: any) => logger.error("[ERROR]", message, ...args);
console.debug = (message: any, ...args: any) => logger.debug("[DEBUG]", message, ...args);
