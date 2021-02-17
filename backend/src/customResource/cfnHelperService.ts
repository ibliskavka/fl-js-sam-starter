import { CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import * as axios from "axios";
import { getLogger } from "../services/logging";

export interface CfnResponse {
    status: "SUCCESS" | "FAILED";
    message: string;
    data?: any;
}

export class CfnHelperService {
    logger = getLogger("CfnHelperService");

    /**
     * Set timer so it triggers one second before this function would timeout.
     */
    setupWatchdogTimer(event: CloudFormationCustomResourceEvent, context: Context): void {
        const timeoutHandler = (): void => {
            this.logger.error("Timeout FAILURE!");
            this.failed(event, context, "Function timed out").then(() => {
                throw new Error("Function timed out");
            });
        };

        setTimeout(timeoutHandler, context.getRemainingTimeInMillis() - 1000);
    }

    async success(event: CloudFormationCustomResourceEvent, context: Context, data: any): Promise<void> {
        return await this.sendResponse(event, context, {
            status: "SUCCESS",
            message: `See the details in CloudWatch Log Stream: ${context.logStreamName}`,
            data,
        });
    }

    async failed(event: CloudFormationCustomResourceEvent, context: Context, message: string): Promise<void> {
        return await this.sendResponse(event, context, {
            status: "FAILED",
            message,
            data: null,
        });
    }

    // Send response to the pre-signed S3 URL
    async sendResponse(
        event: CloudFormationCustomResourceEvent,
        context: Context,
        cfnResponse: CfnResponse
    ): Promise<void> {
        this.logger.debug("Sending response " + cfnResponse.status);

        const body = JSON.stringify({
            Status: cfnResponse.status,
            Reason: cfnResponse.message,
            PhysicalResourceId: event.RequestType === "Create" ? context.logStreamName : event.PhysicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: cfnResponse.data,
        });

        this.logger.debug("RESPONSE BODY:\n", body);

        const response = await axios.default.put(event.ResponseURL, body);

        this.logger.debug("CloudFormation Response", { data: response.data });
        return;
    }
}
