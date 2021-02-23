import { IContactApi, IContact } from "../api-interfaces";
import ConfigurationService from "./ConfigurationService";
import { getLogger, Logger } from "./LoggingService";
import { Auth } from "aws-amplify";

export class ApiClient implements IContactApi {
  logger: Logger;

  constructor(private cfg: ConfigurationService) {
    this.logger = getLogger("DataService");
  }

  async listContacts():  Promise<IContact[]>{
    const response = await this.get(`/contact`);
    return await response.json();
  }

  async getContactById(email: string): Promise<IContact> {
    const response = await this.get(`/contact/${email}`);
    return await response.json();
  }

  async saveContact(contact: IContact): Promise<void> {
    await this.post(`/contact`, contact);
  }

  async deleteContact(email: string): Promise<void> {
    await this.delete(`/contact/${email}`);
  }

  private async get(endpoint: string): Promise<Response> {
    return await this.request(endpoint, "GET")
  }

  private async post(endpoint: string, body?: any): Promise<Response> {
    return await this.request(endpoint, "POST", body)
  }

  private async delete(endpoint: string): Promise<Response> {
    return await this.request(endpoint, "DELETE")
  }

  private async request(endpoint: string, method: string, body?: any): Promise<Response> {
    const auth = `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`;

    const result = await fetch(this.cfg.apiUrl + endpoint, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: auth,
        "Content-Type": "application/json"
      },
    });

    if (result.status < 200 || result.status > 299) {
      const response = { status: result.status, body: await result.json() };
      this.logger.error(`${method} ${endpoint} request failed`, response);
      throw response;
    }
    return result;
  }
}
