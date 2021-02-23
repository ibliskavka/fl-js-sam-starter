import React, { useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import { useContacts } from "../hooks/useContacts";
import { ContactForm } from "./Contact/ContactForm";
import { ContactList } from "./Contact/ContactList";


export const Home = () => {
    const [refresh, setRefresh] = useState(new Date());
    const contacts = useContacts(refresh)

    return (
        <React.Fragment>
            <Grid container stackable columns={2}>
                <Grid.Column>
                    <Segment>
                        <h4>Add</h4>
                        <ContactForm onAdd={(c)=> setRefresh(new Date())} />
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <h4>Contacts</h4>
                        <ContactList contacts={contacts.result} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    );
};
