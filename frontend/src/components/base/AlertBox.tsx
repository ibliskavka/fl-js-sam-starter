import React from "react";
import { Message } from "semantic-ui-react";

interface IProps {
  error: any
}
export const AlertBox = (props: IProps) => {
  if (props.error?.status === 400) {
    return (<Message error>
      <Message.Header>Validation Error</Message.Header>
      <Message.Content>{JSON.stringify(props.error.body)}</Message.Content>
    </Message>);
  }

  if (props.error?.status) {
    return (<Message error>
      <Message.Header>API Error {props.error.status}</Message.Header>
      <Message.Content>{JSON.stringify(props.error.body)}</Message.Content>
    </Message>);
  }

  if (props.error) {
    return (<Message error>
      <Message.Header>Error</Message.Header>
      <Message.Content>{props.error.message || "Unknown Error, check the browser logs"}</Message.Content>
    </Message>);
  }
}