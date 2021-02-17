import { IConnectApi, IProfileRegion, IOption } from "../api-interfaces";
import ConfigurationService from "./ConfigurationService";
import { getLogger, Logger } from "./LoggingService";
import { Auth } from "aws-amplify";

export class ApiClient implements IConnectApi {
  logger: Logger;

  constructor(private cfg: ConfigurationService) {
    this.logger = getLogger("DataService");
  }

  async listInstances(req: IProfileRegion):  Promise<IOption[]>{
    const response = await this.get(`/api/instances?profile=${req.profile}&region=${req.region}`);
    return await response.json();
  }

  private async get(endpoint: string): Promise<Response> {
    return await this.request(endpoint, "GET")
  }

  private async post(endpoint: string, body?: any): Promise<Response> {
    return await this.request(endpoint, "POST")
  }

  private async request(endpoint: string, method: string, body?: any): Promise<Response> {
    const auth = `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`;

    const result = await fetch(this.cfg.apiUrl + endpoint, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: auth,
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
