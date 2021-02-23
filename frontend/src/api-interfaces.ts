import * as Yup from "yup";

// Defined in the API and copied into the front end during build time

// This file is used to keep data structures in sync. Only modify it from its /backend location

export interface IContact {
    name: string;
    phone: string;
    email: string;
}
export const contactSchema = Yup.object({
    name: Yup.string().required().max(40),
    accessKey: Yup.string().required().max(40),
    secretKey: Yup.string().required().max(40),
});


export interface IValidationErrors {
    [name: string]: string[]
}

export interface IValidationResult {
    isValid: boolean;
    errors: IValidationErrors;
}

export const validateSchema = (
    schema: any,
    data: object
): IValidationResult => {
    const response: IValidationResult = {
        isValid: true,
        errors: {},
    };
    try {
        schema.validateSync(data, { abortEarly: false });
    } catch (error) {
        response.isValid = false;
        error.inner.forEach((e: any) => {
            response.errors[e.path] = e.errors;
        });
    }
    return response;
};

export interface IContactApi {
    listContacts: () => Promise<IContact[]>;
    getContactById: (email: string)=> Promise<IContact>;
    saveContact: (contact: IContact) => Promise<void>;
    deleteContact: (email: string) => Promise<void>;
}
