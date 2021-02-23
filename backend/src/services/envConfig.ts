import { ApplicationError } from "../model/applicationError";

/**
 * Provides type-safe configuration access with
 */
export class EnvConfig {

    static get region(): string {
        return this.getEnvVal("AWS_REGION");
    }
    static get stage(): string {
        return this.getEnvVal("STAGE", "prod");
    }

    static get tableName(): string {
        return this.getEnvVal("DATA_TABLE_NAME");
    }

    static get bucketName(): string {
        return this.getEnvVal("DATA_BUCKET_NAME");
    }

    static get verifyFromCloudFrontHeader(): string {
        return process.env.VERIFY_FROM_CF_STRING;
    }

    /**
     * This is hard limit per export. Testing started failing around 100k
     */
    static get maxExportCount(): number {
        return parseInt(process.env.MAX_EXPORT_COUNT || "50000", 10);
    }

    static isMailEnabled(jurisdiction: string): boolean {
        return (process.env.MAIL_ENABLED_CSV || "").split(",").includes(jurisdiction);
    }

    static getEnvVal(name: string, defaultVal: string = ""): string {
        const val = process.env[name] || defaultVal;
        if (!val) {
            throw new ApplicationError(500, `Environment parameter ${name} is undefined`);
        }
        return val;
    }
}