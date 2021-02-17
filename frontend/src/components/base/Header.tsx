import React, { useContext } from "react";
import AmplifyService from "../../services/AmplifyService";
import AppContext from "../../contexts/AppContext";
import { Button, Grid, Icon } from "semantic-ui-react";
import { Image } from 'semantic-ui-react'


export const Header = () => {

  const ctx = useContext(AppContext)

  const LoginButton = () => {
    return (
      <Button
        onClick={() => AmplifyService.federatedLogin()}
        style={{ float: "right" }}
      >
        <Icon name="key" /> LOGIN
      </Button>
    );
  }
  const LogoutButton = () => {
    return (
      <Button
        onClick={() => AmplifyService.logout()}
        style={{ float: "right" }}
      >
        <Icon name="power off" /> LOGOUT
      </Button>
    );
  }

  return (
    <Grid container>
      <Grid.Column width={8}>
        <Image src="logo.png" alt="VF Logo" />
      </Grid.Column>
      <Grid.Column width={8}>
        {!ctx.authenticated
          ? LoginButton()
          : LogoutButton()}
      </Grid.Column>
    </Grid>
  );
}