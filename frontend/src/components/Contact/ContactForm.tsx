import React, { useContext, useState } from "react"
import { Button, Form } from "semantic-ui-react";
import { IContact } from "../../api-interfaces";
import AppContext from "../../contexts/AppContext"

interface IProps {
  onAdd: (contact: IContact)=>void;
}
export const ContactForm = (props: IProps) => {
  const [contact, setContact] = useState<IContact>({
    name:"",
    email:"",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const ctx = useContext(AppContext);

  const submit = async () =>{
    try {
      setMessage("");
      if(!contact.name){
        throw new Error("Name is required")
      }
      if(!contact.email){
        throw new Error("Email is required")
      }
      if(!contact.phone){
        throw new Error("Phone is required")
      }

      await ctx.api.saveContact(contact);
      setTimeout(()=>{
        props.onAdd(contact);
      }, 1000);
      
      setContact({
        name:"",
        email:"",
        phone: "",
      })
      setMessage("Success");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  }

  return (<Form onSubmit={()=> submit()}>
    <Form.Field>
      <label>Name</label>
      <input placeholder='Name' value={contact.name} onChange={(e)=> setContact({...contact, name: e.target.value})} />
    </Form.Field>
    <Form.Field>
      <label>Email</label>
      <input placeholder='Email' value={contact.email} onChange={(e)=> setContact({...contact, email: e.target.value})} />
    </Form.Field>
    <Form.Field>
      <label>Phone</label>
      <input placeholder='Phone' value={contact.phone} onChange={(e)=> setContact({...contact, phone: e.target.value})} />
    </Form.Field>
    <Button type='submit'>Submit</Button>
    {message}
  </Form>)
}