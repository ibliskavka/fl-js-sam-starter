import express, { Application, Request, Response, NextFunction } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import { json } from "body-parser";
import { eventContext } from "aws-serverless-express/middleware";
import { ContactController } from "../controllers/contact.controller";
import { ContactRepository } from "../repositories/contactRepository";
import { EnvConfig } from "../services/envConfig";

export class Api {
    public app: Application;

    constructor(
        private contactRepo: ContactRepository,
    ) {
        this.app = express();
        Promise.all([this.initializeMiddleware(), this.initializeControllers()]);
    }

    private async initializeMiddleware(): Promise<void> {

        // Request Logging
        this.app.use(
            expressWinston.logger({
                transports: [new winston.transports.Console()],
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.json(),
                ),
                meta: true, // optional: control whether you want to log the meta data about the request (default to true)
                msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
                ignoreRoute: (req, res) => {
                    return false;
                }, // optional: allows to skip some log messages based on request and/or response
                headerBlacklist: ["Authorization", "postman-token"], // Don't print authorization header
            }),
        );
        this.app.use(json());

        if (EnvConfig.stage !== "local") {
            this.app.use(eventContext());
        }

        const HTTP_SERVER_ERROR = 500;
        this.app.use((err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            }

            return res.status(err.status || HTTP_SERVER_ERROR).render("Unhandled server error");
        });
    }

    private async initializeControllers(): Promise<void> {
        const contactController: ContactController = new ContactController(
            this.contactRepo,
        );
        contactController.addRoutes(this.app);

        // Handler for routes not found:
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err: any = new Error("Route not found");
            err.status = 404;
            next(err);
        });

        // Error Logging
        this.app.use(
            expressWinston.errorLogger({
                transports: [new winston.transports.Console()],
                format: winston.format.combine(
                    winston.format.json(),
                ),
            }),
        );
    }
}
