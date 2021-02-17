import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Api } from "./lambda/api";
import { ContactRepository } from "./repositories/contactRepository";
import { EnvConfig } from "./services/envConfig";

// This is the local Express server.

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
process.env.AWS_REGION = "us-east-1";
process.env.LOG_LEVEL = "debug";
process.env.STAGE = "local";
process.env.DATA_TABLE_NAME = "fl-js-serverless-demo";

const ddb = new DocumentClient({
    // endpoint: "http://localhost:8000",    //Uncomment to use local DDB
});

const contactRepo = new ContactRepository(EnvConfig.tableName, ddb);
const api = new Api(contactRepo);

const port = 5000;
api.app.listen(port, () => console.log(`server is running on http://localhost:${port}`));
