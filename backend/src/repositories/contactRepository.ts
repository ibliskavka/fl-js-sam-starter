import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { BaseRepository } from "./baseRepository";
import { getLogger } from "../services/logging";
import { IContact } from "../api-interfaces";

interface IContactItem extends IContact{
    pk: string;
    sk: string;
}
/**
 * Implement Dynamo DB interactions for the Contact entity
 */
export class ContactRepository extends BaseRepository {
    readonly pk = "contact";

    constructor(
        private tableName: string,
        ddb: DocumentClient,
    ) {
        super(getLogger("ContactRepository"), ddb);
    }

    public async getAllContacts(): Promise<IContact[]> {
        const params: DocumentClient.QueryInput = {
            TableName: this.tableName,
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": this.pk,
            }
        };
        const results = await this.query<IContactItem>(params) || [];

        results.forEach(x=> {delete x.pk; delete x.sk;});
        return results;
    }

    public async getContact(email: string): Promise<IContact> {
        const contact = await this.getItem<IContactItem>(this.tableName, {
            pk: this.pk,
            sk: email,
        });
        if(contact){
            delete contact.pk;
            delete contact.sk;
        }
        return contact;
    }

    public async putContactItem(contact: IContact): Promise<void> {
        const model: IContactItem = {
            pk: this.pk,
            sk: contact.email,
            ...contact,
        };
        return await this.putItem(this.tableName, model);
    }

    async deleteContactItem(email: string): Promise<void> {
        await this.deleteItem(this.tableName, {pk:this.pk, sk: email});
    }
}
