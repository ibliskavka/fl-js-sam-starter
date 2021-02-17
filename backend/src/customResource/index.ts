import { CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import AWS from "aws-sdk";
import { BadRequestError } from "../model/applicationError";
import { CustomResourceProvider } from "./interfaces";
import { CloudFrontService } from "../services/cloudFrontService";
import { getLogger } from "../services/logging";
import { S3Service } from "../services/s3Service";
import { DeployFrontEndLambda } from "./deployFrontEndLambda";
import { CfnHelperService } from "./cfnHelperService";


/**
 * Sometimes constructors and initializers throw errors. When this happens, a fail message must be sent to CloudFornt or the deploy will hang for 2 hours.
 * This handler is isolated in its own file so some change in the main lambda index does not hang a deploy.
 */
export const handler = async (event: CloudFormationCustomResourceEvent, context: Context): Promise<any> => {
    const logger = getLogger("customResourceHandler");
    const cfn = new CfnHelperService();
    try {
        logger.debug("Event Received", { event });

        // Send error before timeout
        cfn.setupWatchdogTimer(event, context);

        const s3 = new S3Service(new AWS.S3());
        const cloudFront = new CloudFrontService(new AWS.CloudFront());

        let resource: CustomResourceProvider = null;
        switch (event.ResourceType) {
            case "Custom::DeployFrontEnd":
                resource = new DeployFrontEndLambda(s3, cloudFront);
                break;
            default:
                throw new BadRequestError({ ResourceType: [`${event.ResourceType} is an unknown resource type`] });
        }

        const response = await resource.handler(event);
        logger.debug("Custom resource response", { response });
        await cfn.sendResponse(event, context, response);
        return response;
    } catch (error) {
        logger.error("Unhandled exception", { error });
        await cfn.failed(event, context, error.message);
        throw error;
    }
};