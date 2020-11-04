import React, { Component } from 'react';
import FormValidator from '../Components/FormValidator';
import TextInput from '../Components/TextInput'

import * as VisitorServices from '../Api/VisitorServices'

class VisitorEntryPopup extends Component {

    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            { field: 'fullname', method: 'isEmpty', validWhen: false, message: 'Enter Customer Name.' },
            { field: 'mobile_number', method: 'isEmpty', validWhen: false, message: 'Enter Mobile No.' },
            { field: 'mobile_number', method: 'matches', args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/], validWhen: true, message: 'Enter valid Mobile No.' }

        ]);

        this.state = {
            showPopup: false,
            _id: "",
            fullname: "",
            email: "",
            mobile_number: "",
            company: "",
            loading: false,
            submitted: false,
            validation: this.validator.valid()
        }

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.selectedVisitor) {
            this.setState({
                showPopup: props.showPopup,
                _id: props.selectedVisitor._id,
                fullname: props.selectedVisitor.fullname,
                email: props.selectedVisitor.property.email ? props.selectedVisitor.property.email : "",
                mobile_number: props.selectedVisitor.property.mobile_number ? props.selectedVisitor.property.mobile_number : "",
                company: props.selectedVisitor.property.company ? props.selectedVisitor.property.company : "",
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
                company: "",
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

        const { _id, fullname, email, mobile_number, company } = this.state
        const validation = this.validator.validate(this.state)


        if (!validation.isValid) {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 500);
            return
        }

        try {

            let visitor = {
                _id: _id,
                stage: "NEW",
                status: "active",
                fullname: fullname,
                property: {
                    fullname: fullname,
                    email: email,
                    mobile_number: mobile_number,
                    company: company
                }
            }

            const res = await VisitorServices.save(visitor).catch(err => { throw { ...err, errorOn: "Save Host:" } });
            this.handleResponseError(res, "Save Host:");
            visitor = res.data;
            this.props.onSaveHandle(visitor)

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
        const { showPopup, fullname, email, mobile_number, company, loading, submitted } = this.state
        const validation = submitted ? this.validator.validate(this.state) : this.state.validation
        return (
            <>
                <div className={`modal fade ${showPopup === true ? "show" : ""}`} style={{ display: showPopup === true ? "block" : "none" }}>
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.selectedVisitor ? "Edit Visitor" : "Add Visitor"}</h5>
                                <button type="button" className="close" onClick={this.props.onCloseHandle}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container mt-3" >
                                    <TextInput
                                        labelText="Visitor Name"
                                        required={true}
                                        name="fullname"
                                        value={fullname}
                                        placeholder="Enter Visitor Name"
                                        onChangeCallBack={this.onChangeValue}
                                        validationMessage={validation.fullname.message}
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
                                        labelText="Email"
                                        name="email"
                                        value={email}
                                        placeholder="Enter Email"
                                        onChangeCallBack={this.onChangeValue}
                                    />
                                    <TextInput
                                        labelText="Company"
                                        name="company"
                                        value={company}
                                        placeholder="Enter Company"
                                        onChangeCallBack={this.onChangeValue}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.props.onCloseHandle}>Close</button>
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

export default VisitorEntryPopup;
