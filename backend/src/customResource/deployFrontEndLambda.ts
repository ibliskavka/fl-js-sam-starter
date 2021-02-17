import { Logger } from "winston";
import { getLogger } from "../services/logging";
import AdmZip from "adm-zip";
import { CloudFrontService } from "../services/cloudFrontService";
import { S3Path, S3Service } from "../services/s3Service";
import * as fs from "fs";
import { ResourceProps } from "./interfaces";
import { CfnResponse } from "./cfnHelperService";

interface DeployFrontEndProps extends ResourceProps<{ Source:string; Destination: string; DistributionId: string, Config: any }> { }

export class DeployFrontEndLambda {
    logger: Logger;
    constructor(private s3: S3Service, private cloudFront: CloudFrontService) {
        this.logger = getLogger("AssociateApprovedOrigin");
    }

    public async handler(event: DeployFrontEndProps): Promise<CfnResponse> {
        this.validateInput(event);

        switch (event.RequestType) {
            case "Create":
                return await this.create(event);
            case "Update":
                return await this.update(event);
            case "Delete":
                return await this.delete(event);
            default:
                return {
                    status: "FAILED",
                    message: "Unknown request type",
                    data: null,
                };
        }
    }

    validateInput(event: DeployFrontEndProps): void {
        if(!event.ResourceProperties.Source){
            throw new Error("Source property is required");
        }
        const dest = event.ResourceProperties.Destination;
        if (!dest) {
            throw new Error("Destination property is required");
        }
        if (!this.s3.pathIsValid(dest)) {
            throw new Error("Destination property must begin with s3://");
        }

        if (!event.ResourceProperties.Config) {
            throw new Error("Config property is required");
        }
    }

    async create(event: DeployFrontEndProps): Promise<CfnResponse> {
        return await this.extractToS3(event);
    }

    async update(event: DeployFrontEndProps): Promise<CfnResponse> {
        try {
            const oldDest = this.s3.parseS3Path(event.OldResourceProperties?.Destination as string);
            await this.s3.emptyS3Directory(oldDest.bucket, oldDest.key);
        } catch (error) {
            return {
                status: "FAILED",
                message: "Failed cleaning deleting destination bucket files",
                data: null,
            };
        }
        return await this.extractToS3(event);
    }

    async delete(event: DeployFrontEndProps): Promise<CfnResponse> {
        try {
            const dest = this.destination(event);
            const count = await this.s3.emptyS3Directory(dest.bucket, dest.key);
            return {
                status: "SUCCESS",
                message: `Deleted ${count} files at destination path`,
                data: null,
            };
        } catch (error) {
            return {
                status: "FAILED",
                message: "Failed deleting destination path files. " + error.message,
                data: null,
            };
        }
    }
    async extractToS3(event: DeployFrontEndProps): Promise<CfnResponse> {
        const dest = this.destination(event);

        let data: Buffer;
        try {
            data = fs.readFileSync(event.ResourceProperties.Source);
        } catch (error) {
            return {
                status: "FAILED",
                message: "Failed downloading zip: " + error.message,
            };
        }

        let zipEntries: AdmZip.IZipEntry[];
        try {
            const zip = new AdmZip(data);
            zipEntries = zip.getEntries();
        } catch (error) {
            return {
                status: "FAILED",
                message: "Failed to unzip download: " + error.message,
            };
        }

        const prefix = dest.key ? `${dest.key}/` : "";
        try {
            console.log(`Uploading ${zipEntries.length} files`);
            for (const entry of zipEntries) {
                let fileData = entry.getData();
                if (entry.entryName === "config.json") {
                    const config = JSON.parse(fileData.toString());
                    Object.assign(config, event.ResourceProperties.Config);
                    const configJson = JSON.stringify(config, null, 2);

                    console.log("Writing configuration file", configJson);
                    fileData = Buffer.from(configJson);
                }

                const key = `${prefix}${entry.entryName}`;
                console.log(`Uploading ${key}`);
                await this.s3.put(dest.bucket, key, fileData);
            }
        } catch (error) {
            return {
                status: "FAILED",
                message: "Failed uploading to S3: " + error.message,
            };
        }

        try {
            await this.cloudFront.createInvalidation(event.ResourceProperties.DistributionId);
        } catch (error) {
            return {
                status: "SUCCESS",
                message: "Failed to invalidate CloudFront " + error.message,
            };
        }

        return {
            status: "SUCCESS",
            message: `Extracted ${zipEntries.length} files`,
        };
    }

    destination(event: DeployFrontEndProps): S3Path {
        return this.s3.parseS3Path(event.ResourceProperties.Destination);
    }
}
