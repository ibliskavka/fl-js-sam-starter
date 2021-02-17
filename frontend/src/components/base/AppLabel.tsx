import React from "react"

export interface ILabelProps {
  label: string,
  subLabel?: string,
  subLabelLink?: string,
  required?: boolean,
}
export const AppLabel = (props: ILabelProps) => {

  const subLabel = (props.subLabel && props.subLabelLink)
    ? <p><small><a href={props.subLabelLink} target="_blank">{props.subLabel}</a></small></p>
    : props.subLabel
      ? <p><small>{props.subLabel}</small></p>
      : null

  return (
    <>
      <label className="app-label">{props.required && <span className="required-field">*</span>}{props.label}
        {subLabel}
      </label>
    </>);
}