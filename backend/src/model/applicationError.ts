import { IValidationErrors } from "../api-interfaces";

export class ApplicationError extends Error {
    constructor(public statusCode: number, public detail: string) {
        super(`${statusCode}: ${detail}`);
        this.name = "ApplicationError";
    }
}

export class BadRequestError extends Error {
    public statusCode: number;

    constructor(public errors: IValidationErrors) {
        super("BadRequest");
        this.name = "BadRequestError";
        this.statusCode = 400;
    }
}