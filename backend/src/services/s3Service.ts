import { getLogger } from "./logging";
import { S3 } from "aws-sdk";
import { DeleteObjectsRequest, PutObjectOutput, PutObjectRequest } from "aws-sdk/clients/s3";
import mime from "mime-types";
import * as url from "url";

export interface S3Path {
    bucket: string;
    key: string;
}

export class S3Service {
    logger = getLogger("S3Service");

    constructor(private s3: S3) {
    }

    public async move(bucket: string, oldKey: string, newKey: string): Promise<any> {
        try {
            await this.s3.copyObject({
                CopySource: `${bucket}/${oldKey}`,
                Bucket: bucket,
                Key: newKey
            }).promise();
            await this.s3.deleteObject({
                Bucket: bucket,
                Key: oldKey,
            }).promise();
        } catch (error) {
            this.logger.error("move", {bucket, oldKey, newKey});
            throw error;
        }
    }

    public async getZip(bucket: string, key: string): Promise<Buffer> {
        try {
            const params: any = {
                Bucket: bucket,
                Key: key,
            };
            const result = await this.s3.getObject(params).promise();
            if (result.ContentType !== "application/zip") {
                throw new Error("Expected content type application/zip, got " + result.ContentType);
            }
            return result.Body as Buffer;
        } catch (error) {
            this.logger.error("getZip", {key, error});
            throw error;
        }
    }

    public async put(bucket: string, key: string, data: any, meta?: any): Promise<PutObjectOutput> {
        try {
            const mimeType = mime.lookup(key);
            const params: PutObjectRequest = {
                Bucket: bucket,
                Key: key,
                Body: data,
                ContentType: mimeType.toString(),
                Metadata: meta
            };

            return await this.s3.putObject(params).promise();
        } catch (error) {
            this.logger.error("S3 - failed put", {key, error});
            throw error;
        }
    }

    public async emptyS3Directory(bucket: string, dir: string): Promise<void> {
        this.logger.debug(`Emptying S3 Directory ${bucket}/${dir}`);

        const listParams = {
            Bucket: bucket,
            Prefix: dir,
        };

        const listedObjects = await this.s3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents?.length === 0) {
            return;
        }

        const deleteParams: DeleteObjectsRequest = {
            Bucket: bucket,
            Delete: { Objects: [] },
        };

        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key: Key as string });
        });

        await this.s3.deleteObjects(deleteParams).promise();

        this.logger.debug(`Deleted ${listedObjects.Contents.length} files at ${bucket}/${dir}`);

        if (listedObjects.IsTruncated) {
            await this.emptyS3Directory(bucket, dir);
        }
    }

    public pathIsValid(path: string): boolean {
        const regex = /^s3:\/\/.+$/gm;
        return regex.test(path);
    }

    public parseS3Path(s3Path: string): S3Path {
        const parsed = url.parse(s3Path);
        const result = {
            bucket: parsed.hostname,
            key: parsed.path && parsed.path.startsWith("/") ? parsed.path.substr(1) : parsed.path,
        };
        if (!result.key) {
            result.key = "";
        }
        return result as any;
    }
}
