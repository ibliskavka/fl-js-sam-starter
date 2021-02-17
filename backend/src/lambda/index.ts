import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ContactRepository } from "../repositories/contactRepository";
import { Api } from "./api";
import { createServer, proxy } from "aws-serverless-express";
import { EnvConfig } from "../services/envConfig";

/**
 * Lambda expects functions, not objects.
 * This index file handles object initialization and exposes functions.
 */

const db = new DocumentClient();
const tableName = EnvConfig.tableName;
const contactRepo = new ContactRepository(tableName, db);

export const api = (event: APIGatewayProxyEvent, context: Context): void => {
    const api = new Api(contactRepo);
    proxy(createServer(api.app), event, context);
};