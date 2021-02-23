import React from "react";
import { Table } from "semantic-ui-react";
import { IContact } from "../../api-interfaces";

interface IProps {
  contacts: IContact[]
}
export const ContactList = (props: IProps) => {

  const renderContact = (contact: IContact) => {
    return (<Table.Row>
      <Table.Cell>{contact.name}</Table.Cell>
      <Table.Cell>{contact.email}</Table.Cell>
      <Table.Cell>{contact.phone}</Table.Cell>
    </Table.Row>)
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Phone</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.contacts.map(x => (renderContact(x)))}
      </Table.Body>
    </Table>
  )
}