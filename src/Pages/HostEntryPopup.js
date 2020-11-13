import React, { Component } from 'react';
import FormValidator from '../Components/FormValidator';
import TextInput from '../Components/TextInput'

import * as HostServices from '../Api/HostServices'

class HostEntryPopup extends Component {

    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            { field: 'fullname', method: 'isEmpty', validWhen: false, message: 'Enter Customer Name.' },
            { field: 'email', method: 'isEmpty', validWhen: false, message: 'Enter Email.' },
            { field: 'email', method: 'isEmail', validWhen: true, message: 'Enter Valid Email.' },
            { field: 'mobile_number', method: 'isEmpty', validWhen: false, message: 'Enter Mobile No.' },
            { field: 'mobile_number', method: 'matches', args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/], validWhen: true, message: 'Enter valid Mobile No.' }
        ]);

        this.state = {
            showPopup: false,
            _id: "",
            fullname: "",
            email: "",
            mobile_number: "",
            department: "",
            loading: false,
            submitted: false,
            validation: this.validator.valid()
        }

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.selectedHost) {
            this.setState({
                showPopup: props.showPopup,
                _id: props.selectedHost._id,
                fullname: props.selectedHost.fullname,
                email: props.selectedHost.property.email ? props.selectedHost.property.email : "",
                mobile_number: props.selectedHost.property.mobile_number ? props.selectedHost.property.mobile_number : "",
                department: props.selectedHost.property.department ? props.selectedHost.property.department : "",
                loading: false,
                submitted: false
            });
        } else {
            this.setState({
                showPopup: props.showPopup,
                _id: "",
                fullname: "",
                email: "",
                mobile_number: "",
                department: "",
                loading: false,
                submitted: false
            });
        }
    }

    onChangeValue = (event) => {
        //event.preventDefault();
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onSave = async () => {
        this.setState({ submitted: true, loading: true })

        const { _id, fullname, email, mobile_number, department } = this.state
        const validation = this.validator.validate(this.state)


        if (!validation.isValid) {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 500);
            return
        }

        try {

            let host = {
                _id: _id,
                status: "active",
                username: email,
                password: "Abcd123",
                fullname: fullname,
                role: {
                    _id: "5eafcd42cf26f78f43ab6c71"
                },
                property: {
                    fullname: fullname,
                    email: email,
                    mobile_number: mobile_number,
                    department: department
                }
            }

            const res = await HostServices.save(host).catch(err => { throw { ...err, errorOn: "Save Host:" } });
            this.handleResponseError(res, "Save Host:");
            host = res.data;
            this.props.onSaveHandle(host)

        } catch (error) {
            console.log('ERROR HOST ENTRY! Error ON:' + error.errorOn, error)
        }
        finally {
            this.setState({ loading: false })
        }
    }

    handleResponseError = (res, errorOn) => {
        if (res.data.errors || res.status !== 200) {
            throw { ...res, errorOn: errorOn }
        }
    }

    render() {
        const { showPopup, fullname, email, mobile_number, department, loading, submitted } = this.state
        const validation = submitted ? this.validator.validate(this.state) : this.state.validation
        return (
            <>
                <div className={`modal fade ${showPopup === true ? "show" : ""}`} style={{ display: showPopup === true ? "block" : "none" }}>
                    <div className="modal-dialog  m-0 mw-100 vh-100 modal-full modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.selectedHost ? "Edit Host" : "Add Host"}</h5>
                                <button type="button" className="close" onClick={this.props.onCloseHandle}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="container mt-3">
                                    <TextInput
                                        labelText="Host Name"
                                        required={true}
                                        name="fullname"
                                        value={fullname}
                                        placeholder="Enter Host Name"
                                        onChangeCallBack={this.onChangeValue}
                                        validationMessage={validation.fullname.message}
                                    />
                                    <TextInput
                                        labelText="Email"
                                        required={true}
                                        name="email"
                                        value={email}
                                        placeholder="Enter Email"
                                        onChangeCallBack={this.onChangeValue}
                                        validationMessage={validation.email.message}
                                    />
                                    <TextInput
                                        labelText="Mobile Number"
                                        required={true}
                                        name="mobile_number"
                                        value={mobile_number}
                                        placeholder="Enter Mobile Number"
                                        onChangeCallBack={this.onChangeValue}
                                        validationMessage={validation.mobile_number.message}
                                    />
                                    <TextInput
                                        labelText="Department"
                                        name="department"
                                        value={department}
                                        placeholder="Enter Department"
                                        onChangeCallBack={this.onChangeValue}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onCloseHandle}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.onSave} disabled={loading}>
                                    {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default HostEntryPopup;