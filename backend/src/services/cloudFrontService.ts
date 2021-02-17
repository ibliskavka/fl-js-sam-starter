import { CreateInvalidationRequest } from "aws-sdk/clients/cloudfront";
import { getLogger } from "./logging";

export class CloudFrontService {
    logger = getLogger("CloudFrontService");

    constructor(private cf: AWS.CloudFront) { }

    async createInvalidation(distributionId: string): Promise<void> {
        try {
            const params: CreateInvalidationRequest = {
                DistributionId: distributionId,
                InvalidationBatch: {
                    CallerReference: (new Date()).getTime().toString(),
                    Paths: {
                        Quantity: 1,
                        Items: [
                            "/*"
                        ]
                    }
                }
            };
            await this.cf.createInvalidation(params).promise();
        } catch (error) {
            this.logger.error("createInvalidation", { error });
            throw error;
        }
    }
}