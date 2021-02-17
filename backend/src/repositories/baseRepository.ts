import { DocumentClient, ScanInput } from "aws-sdk/clients/dynamodb";
import { Logger } from "winston";

export abstract class BaseRepository {
    constructor(protected logger: Logger, protected ddb: DocumentClient) { }

    protected async getItem<TModel>(table: string, key: DocumentClient.Key, attributes?: string[]): Promise<TModel> {
        this.logger.debug("getItem", { table, key });
        const params: DocumentClient.GetItemInput = {
            TableName: table,
            Key: key,
        };
        if (attributes && attributes.length > 0) {
            params.AttributesToGet = attributes;
        }
        try {
            const res = await this.ddb.get(params).promise();
            if (res.Item) {
                return res.Item as TModel;
            }
        } catch (error) {
            this.logger.error("getItem", { table, key, error });
            throw error;
        }
        return null;
    }

    protected async putItem<TModel>(table: string, item: TModel) {
        try {
            const params: DocumentClient.PutItemInput = {
                TableName: table,
                Item: item,
            };
            await this.ddb.put(params).promise();
        } catch (error) {
            this.logger.error("putItem", { table, error });
            throw error;
        }
    }

    protected async deleteItem(table: string, key: DocumentClient.Key) {
        try {
            const params: DocumentClient.DeleteItemInput = {
                TableName: table,
                Key: key
            };
            await this.ddb.delete(params).promise();
        } catch (error) {
            this.logger.error("deleteItem", { table, error });
            throw error;
        }
    }

    /**
     * Implements query with paging.
     */
    protected async query<TModel>(q: DocumentClient.QueryInput): Promise<TModel[]> {
        let results = [];
        let pageCount = 0;
        do {
            const response = await this.ddb.query(q).promise();
            results = results.concat(response.Items);
            q.ExclusiveStartKey = response.LastEvaluatedKey;
            pageCount++;
        } while (q.ExclusiveStartKey);

        this.logger.debug("query", { table: q.TableName, itemCount: results.length, pageCount: pageCount });
        return results;
    }

    async scan<TModel>(tableName: string, limit?: number): Promise<TModel[]> {
        let results = [];
        let pageCount = 0;

        const params: ScanInput = {
            TableName: tableName,
            Limit: limit,
        };

        do {
            const response = await this.ddb.scan(params).promise();
            results = results.concat(response.Items);
            params.ExclusiveStartKey = response.LastEvaluatedKey;
            pageCount++;
        } while (params.ExclusiveStartKey);

        this.logger.debug("scan", { table: params.TableName, itemCount: results.length, pageCount: pageCount });
        return results;
    }

    /**
     * Implements count with paging.
     */
    async count(q: DocumentClient.QueryInput, limit: number): Promise<number> {
        q.Select = "COUNT";
        if (limit) {
            q.Limit = limit;
        }

        let pageCount = 0;
        let count = 0;
        do {
            const response = await this.ddb.query(q).promise();
            count += response.Count;
            q.ExclusiveStartKey = response.LastEvaluatedKey;
            pageCount++;
        } while (q.ExclusiveStartKey);

        this.logger.debug("count", { table: q.TableName, count: count, pageCount: pageCount });
        return count;
    }
}
