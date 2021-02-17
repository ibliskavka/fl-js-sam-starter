import { Application, Request, Response, NextFunction } from "express";
import { ContactRepository } from "../repositories/contactRepository";

export class ContactController {
    constructor(private repo: ContactRepository) {
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
    }

    public addRoutes(app: Application): void {
        app.get("/contact", this.get);
        app.get("/contact/:id", this.getById);
        app.post("/contact", this.post);
        app.delete("/contact/:id", this.delete);
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.repo.getAllContacts().then((data)=> res.json(data)).catch(next);
    }

    getById(req: Request, res: Response, next: NextFunction) {
        this.repo.getContact(req.params.id).then(contact=>{
            return contact ? res.json(contact) : res.status(404).end();
        }).catch(next);
    }

    post(req: Request, res: Response, next: NextFunction) {
        this.repo.putContactItem(req.body).then(()=> res.status(201).end()).catch(next);
    }

    delete(req: Request, res: Response, next: NextFunction) {
        this.repo.deleteContactItem(req.params.id).then(()=> res.status(200).end()).catch(next);
    }
}
