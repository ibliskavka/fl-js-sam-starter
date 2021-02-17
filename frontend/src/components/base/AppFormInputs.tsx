import React, { useEffect, useState } from "react";
import { Checkbox, CheckboxProps, Dropdown, DropdownProps, Form, Grid, InputOnChangeData, Message, Radio, Segment } from "semantic-ui-react";
import { IOption } from "../../api-interfaces";
import { AppLabel, ILabelProps } from "./AppLabel";



interface IFieldProps extends ILabelProps {
  name: string;
  disabled?: boolean;
  initialValue?: any;
  onChanged: (val: any) => void;
  error?: string;
}

interface IOptionProps extends IFieldProps {
  options: IOption[];
  wildcard?: boolean;
}

export const AppTextbox = (props: IFieldProps) => {
  const [value, setValue] = useState(props.initialValue)

  const handleChange = (e: any, data: InputOnChangeData) => {
    setValue(data.value);
  }

  const handleBlur = () => {
    props.onChanged(value);
  }

  return (<Form.Input
    label={props.label}
    required={props.required}
    name={props.name}
    onChange={handleChange}
    value={value}
    disabled={props.disabled}
    error={props.error && { content: props.error }}
    onBlur={handleBlur}
  />)
}

export const AppNumberField = (props: IFieldProps) => {
  const [value, setValue] = useState(props.initialValue)

  const handleChange = (e: any, data: InputOnChangeData) => {
    try {
      const newVal = parseInt(data.value, 10);
      if (isNaN(newVal) || newVal < 0) {
        setValue(0);
      } else {
        setValue(newVal);
      }
    } catch (error) {
      setValue(0);
    }
  }

  const handleBlur = () => {
    props.onChanged(value);
  }

  return (<Form.Input
    label={props.label}
    required={props.required}
    name={props.name}
    onChange={handleChange}
    value={value}
    disabled={props.disabled}
    error={props.error && { content: props.error }}
    onBlur={handleBlur}
  />)
}


export const AppDropdown = (props: IOptionProps) => {

  const [value, setValue] = useState(props.initialValue)

  const handleChange = (e: any, data: DropdownProps) => {
    setValue(data.value);
  }

  const handleBlur = () => {
    props.onChanged(value);
  }

  return (<Form.Field width={12} inline={false}>
    <AppLabel label={props.label} subLabel={props.subLabel} subLabelLink={props.subLabelLink} required={props.required} />
    <Dropdown
      search selection
      value={value}
      options={props.options}
      onChange={handleChange}
      disabled={props.disabled}
      onBlur={handleBlur}
      fluid
    />
    <Message error hidden={!props.error}>
      {props.error}
    </Message>
  </Form.Field>)
}


export const AppRadioGroup = (props: IOptionProps) => {
  const [value, setValue] = useState(props.initialValue)

  const handleClick = (newVal: string) => {
    if (props.disabled) {
      return;
    }
    setValue((value === newVal) ? "" : newVal);
  }

  const handleBlur = () => {
    props.onChanged(value);
  }

  const renderOption = (option: IOption) => {
    const key = `${props.name}-${option.value}`;
    return (<Form.Field key={key}>
      <Radio
        label={option.text}
        name={props.name}
        value={value}
        checked={value === option.value}
        onClick={() => handleClick(option.value)}
        disabled={props.disabled}
        onBlur={handleBlur}
      />
    </Form.Field>)
  }

  return (<Segment>
    <AppLabel label={props.label} subLabel={props.subLabel} subLabelLink={props.subLabelLink} required={props.required} />
    <Message error visible={props.error ? true : false}>
      {props.error}
    </Message>
    {props.options.map(renderOption)}
  </Segment>);
}


export const AppCheckboxGroup = (props: IOptionProps) => {

  const [wildcard, setWildcard] = useState(props.initialValue.includes("*"));
  const [value, setValue] = useState<string[]>(props.initialValue)

  const handleClick = (e: any, data: CheckboxProps) => {
    if (props.disabled || wildcard) {
      return;
    }
    const option = data.value.toString();

    if (data.checked) {
      if (!value.includes(option)) {
        setValue([...value, option]);
      }
    } else {
      const index = value.indexOf(option);
      if (index > -1) {
        value.splice(index, 1);
        setValue([...value]);
      }
    }
  }

  const handleClickWildcard = (e: any, data: CheckboxProps) => {
    if (props.disabled) {
      return;
    }

    if (data.checked) {
      setValue(["*"])
      setWildcard(true)
    } else {
      setValue([])
      setWildcard(false)
    }
  }

  useEffect(() => {
    props.onChanged(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const renderOption = (option: IOption) => {
    const key = `${props.name}-${option.value}`;
    return (
      <Grid.Column width={8} key={key}>
        <Form.Field>
          <Checkbox
            label={option.text}
            name={props.name}
            value={option.value}
            checked={value.includes(option.value)}
            onClick={handleClick}
            disabled={props.disabled || wildcard}
          />
        </Form.Field>
      </Grid.Column>
    )
  }

  return (<Segment>
    <Grid stackable>
      <Grid.Column width={16} key={`${props.name}-label`}>
        <AppLabel label={props.label} subLabel={props.subLabel} subLabelLink={props.subLabelLink} required={props.required} />
        <Message error visible={props.error ? true : false}>
          {props.error}
        </Message>
      </Grid.Column>

      {props.wildcard && <Grid.Column width={8} key={`${props.name}-wildcard`}>
        <Checkbox label="N/A" disabled={props.disabled} onClick={handleClickWildcard} checked={value.includes("*")} />
      </Grid.Column>}

      {props.options.map(renderOption)}
    </Grid>
  </Segment>);
}
