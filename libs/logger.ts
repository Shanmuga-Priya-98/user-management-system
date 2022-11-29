import { createLogger, transports } from "winston";

// create application logger
function createApplicationLogger() {
  // default log level
  let logLevel = "info";
  if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL;
  }

  return createLogger({
    level: logLevel,
    transports: [new transports.Console()],
    silent: process.env.SILENCE_LOGGER !== undefined,
  });
}

const logger = createApplicationLogger();
export default logger;
