import { Application, Request, Response, NextFunction } from "express";
import { ContactService } from "./contact.service";

/**
 * This controller is responsible for decoding the requests and sending the correct responses
 * Additionally, the controller should check the user claims in the Authorization Header to confirm user is authorized.
 * Any business logic should live in ContactService
 */
export class ContactController {
    constructor(private service: ContactService) {
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
    }

    public addRoutes(app: Application): void {
        app.get("/api/contact", this.get);
        app.get("/api/contact/:id", this.getById);
        app.post("/api/contact", this.post);
        app.delete("/api/contact/:id", this.delete);
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.service.listContacts().then((data)=> res.json(data)).catch(next);
    }

    getById(req: Request, res: Response, next: NextFunction) {
        this.service.getContactById(req.params.id).then(contact=>{
            return contact ? res.json(contact) : res.status(404).end();
        }).catch(next);
    }

    post(req: Request, res: Response, next: NextFunction) {
        this.service.saveContact(req.body).then(()=> res.status(201).end()).catch(next);
    }

    delete(req: Request, res: Response, next: NextFunction) {
        this.service.deleteContact(req.params.id).then(()=> res.status(200).end()).catch(next);
    }
}
