import { getIn } from "formik";
import React, { useContext, useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import { IOption, IProfileRegion } from "../../api-interfaces";
import AppContext from "../../contexts/AppContext";
import { useInstance } from "../../hooks/useInstance";
import { AppCheckboxGroup, AppDropdown, AppNumberField } from "./AppFormInputs";

const getErrorText = (formik: any, name: string): any => {
    return getIn(formik.touched, name) && getIn(formik.errors, name)
        ? getIn(formik.errors, name)
        : null;
};


const formatOptions = (options: string[]): IOption[] => {
    return options.map(x => ({ text: x, value: x }));
}


export interface ISimpleField<TValue> {
    onChanged: (value: TValue) => void,
    disabled: boolean
}
export const SourceProfileSelector = (props: ISimpleField<IProfileRegion>) => {

    const ctx = useContext(AppContext)
    const [profiles] = useState(formatOptions(ctx.groups.filter(x => x !== "admin")));
    const [regions] = useState(formatOptions(["us-east-1", "us-west-2"]));

    const [value, setValue] = useState({ profile: "", region: "" });

    const handleProfileChange = (profile: string) => {
        setValue({
            ...value,
            profile
        });
        props.onChanged(value);
    }

    const handleRegionChange = (region: string) => {
        setValue({
            ...value,
            region
        });
        props.onChanged(value);
    }

    return (
        <Grid>
            <Grid.Column width={8}>
                <AppDropdown
                    name="profile"
                    label="Profile"
                    required={true}
                    options={profiles}
                    disabled={props.disabled}
                    onChanged={(value) => props.onChanged(value)}
                />
            </Grid.Column>
            <Grid.Column width={8}>
                <AppDropdown
                    name="region"
                    label="Region"
                    required={true}
                    options={regions}
                    disabled={props.disabled}
                    onChanged={(value) => props.onChanged(value)}
                />
            </Grid.Column>
        </Grid>
    )
}

interface InstanceSelectorProps extends ISimpleField<string> {
    request: IProfileRegion
}
export const SourceInstance = (props: InstanceSelectorProps) => {

    const instances = useInstance(props.request);
    return (
        <Segment>
            <AppDropdown
                name="sourceInstance"
                label="Source Instance"
                required={true}
                options={instances.result}
                disabled={instances.loading}
                onChanged={(value) => props.onChanged(value)}
            />
        </Segment>
    )
}

export const TargetInstance = (props: InstanceSelectorProps) => {

    const instances = useInstance(props.request);
    return (
        <Segment>
            <AppDropdown
                name="targetInstance"
                label="target Instance"
                required={true}
                options={instances.result}
                disabled={instances.loading}
                onChanged={(value) => props.onChanged(value)}
            />
        </Segment>
    )
}

// export const AgeQuestion = (props: { formik: any, disabled?: boolean }) => {

//     const [options] = useState(formatOptions(FormOptions.age))

//     const name = "age"
//     return (
//         <AppCheckboxGroup
//             name={name}
//             label="Age"
//             required={true}
//             options={options}
//             disabled={props.disabled}
//             initialValue={props.formik.values[name]}
//             onChanged={(value) => props.formik.setFieldValue(name, value)}
//             error={getErrorText(props.formik, name)}
//             wildcard={false}
//         />
//     )
// }


export const PreviewLimitQuestion = (props: { formik: any, disabled?: boolean }) => {

    const name = "previewLimit";

    return (
        <AppNumberField
            name={name}
            label="Preview Limit"
            required={true}
            disabled={props.disabled}
            initialValue={props.formik.values[name]}
            onChanged={(value) => props.formik.setFieldValue(name, value)}
            error={getErrorText(props.formik, name)}
        />
    )
}

export const ExportLimitQuestion = (props: { formik: any, disabled?: boolean }) => {

    const name = "exportLimit";

    return (
        <AppNumberField
            name={name}
            label="Export Limit"
            required={true}
            disabled={props.disabled}
            initialValue={props.formik.values[name]}
            onChanged={(value) => props.formik.setFieldValue(name, value)}
            error={getErrorText(props.formik, name)}
        />
    )
}