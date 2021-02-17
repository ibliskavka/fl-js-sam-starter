import * as winston from "winston";

export const getLogger = (serviceName: string) => {
    return winston.createLogger({
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
        transports: [
            new winston.transports.Console({
                format: winston.format.json(),
            }),
        ],
    });
};
