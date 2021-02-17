export class Logger {
    private logTrace: boolean = true;

    constructor(private name: string) {}

    debug(message: string, ...properties: any[]) {
        if (this.logTrace) {
            console.debug(message, properties);
        }
    }

    error(message: string, ...properties: any[]) {
        console.error(message, properties);
    }
}

const loggers: { [name: string]: Logger } = {};

export const getLogger = (serviceName: string): Logger => {
    if (!loggers[serviceName]) {
        loggers[serviceName] = new Logger(serviceName);
    }
    return loggers[serviceName];
};
