import React from "react";
import { Grid, Message } from "semantic-ui-react";

export default class Logout extends React.Component {
    render() {
        return (
            <Grid container columns={3} className="logout" centered>
                <Grid.Column>
                    <Message success>
                        <h4>Success</h4>
                        <p>Logged Out</p>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
