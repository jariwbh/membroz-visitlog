import React from 'react'

export default function TextInput(props) {
    return (
        <div className="form-group row">
            <label htmlFor={props.name} className="col-sm-4 col-form-label">{props.labelText}
                {props.required &&
                    <span style={{ color: 'red' }}>*</span>
                }
              &nbsp;:
            </label>
            <div className="col-sm-8">
                <input
                    type="text"
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    className="form-control"
                    onChange={props.onChangeCallBack}
                />
                {props.validationMessage &&
                    <span className="help-block">{props.validationMessage}</span>
                }
            </div>
        </div>
    )
}
