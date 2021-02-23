import { IContact } from "../../src/api-interfaces";
import _ from "lodash";
import { TestUtil } from "../testUtil";

describe("api", () => {

    it("GET /contact should return 200", async () => {
        const response = await TestUtil.get("/contact");
        expect(response.status).toBe(200);

        const items: IContact[] = await response.json();
        expect(items.length).toBeGreaterThan(0);
    });

    it("POST /contact should return 201", async () => {
        const contact: IContact = {
            name: "Ivan Bliskavka",
            phone: "+12223334444",
            email: "ivan@test.com"
        };

        const response = await TestUtil.post("/contact", contact);
        expect(response.status).toBe(201);
    });

    it("GET /contact/:id should return 200", async () => {
        const listResponse = await TestUtil.get("/contact");
        expect(listResponse.status).toBe(200);
        
        const list: IContact[] = await listResponse.json();
        expect(list.length).toBeGreaterThan(0);

        const expected = _.sample(list);
        
        const itemResponse = await TestUtil.get(`/contact/${expected.email}`);
        expect(itemResponse.status).toBe(200);

        const item: IContact = await itemResponse.json();
        expect(item).toStrictEqual(expected);
    });

    it("DELETE /contact/:id should return 200", async () => {
        const contact: IContact = {
            name: "Delete Me",
            phone: "+12223334444",
            email: "delete@me.com"
        };

        const response = await TestUtil.post("/contact", contact);
        expect(response.status).toBe(201);

        let exists = await TestUtil.get(`/contact/${contact.email}`);
        expect(exists.status).toBe(200);

        const deleteResponse = await TestUtil.delete(`/contact/${contact.email}`);
        expect(deleteResponse.status).toBe(200);

        exists = await TestUtil.get(`/contact/${contact.email}`);
        expect(exists.status).toBe(404);
    });
});