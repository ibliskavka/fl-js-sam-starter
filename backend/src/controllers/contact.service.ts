import { IContact, IContactApi } from "../api-interfaces";
import { ContactRepository } from "../repositories/contactRepository";

/**
 * Class implements the business logic of the API
 * This is a trivial example, but these methods could check for validity, etc.
 */
export class ContactService implements IContactApi {
    constructor(private repo: ContactRepository) {

    }
    async listContacts(): Promise<IContact[]> {
        return this.repo.getAllContacts();
    }

    async getContactById(email: string): Promise<IContact> {
        return this.repo.getContact(email);
    }
    async saveContact(contact: IContact): Promise<void> {
        this.repo.putContactItem(contact);
    }
    async deleteContact(email: string): Promise<void> {
        this.repo.deleteContactItem(email);
    }
}