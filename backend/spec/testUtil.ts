import fetch, { Response } from "node-fetch";

/**
 * Simple helper class, consider using process.env for api URL to help with testing in pipeline
 */
export class TestUtil {
    // Defaults
    static readonly baseUrl = "http://localhost:5000";
    static readonly headers = { "Content-Type": "application/json" };

    static get(endpoint: string): Promise<Response> {
        return fetch(`${this.baseUrl}${endpoint}`, { method: "get", headers: this.headers });
    }
    static post(endpoint: string, body: any): Promise<Response> {
        return fetch(`${this.baseUrl}${endpoint}`, { method: "post", body: JSON.stringify(body), headers: this.headers });
    }
    static delete(endpoint: string): Promise<Response> {
        return fetch(`${this.baseUrl}${endpoint}`, { method: "delete", headers: this.headers });
    }
}