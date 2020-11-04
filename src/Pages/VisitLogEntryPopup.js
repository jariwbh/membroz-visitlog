import React, { Component } from 'react';
import SelectSearch from 'react-select-search';
import FormValidator from '../Components/FormValidator';
import TextInput from '../Components/TextInput'

import { VISITLOGSTEPS } from '../Helpers/CommonEnums'

import * as VisitorServices from '../Api/VisitorServices'
import * as HostServices from '../Api/HostServices'
import * as VisitLogServices from '../Api/VisitLogServices'

class VisitLogEntryPopup extends Component {

    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            { field: 'visitorname', method: 'isEmpty', validWhen: false, message: 'Enter Visitor Name.' },
            { field: 'visitor_mobile_number', method: 'isEmpty', validWhen: false, message: 'Enter Mobile No.' },
            { field: 'visitor_mobile_number', method: 'matches', args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/], validWhen: true, message: 'Enter valid Mobile No.' },
            { field: 'hostname', method: 'isEmpty', validWhen: false, message: 'Enter Host Name.' }
        ]);

        this.state = {
            visitLogStep: VISITLOGSTEPS.STEP1,
            showPopup: false,
            visitorList: [],
            hostList: [],
            _id: "",
            visitorid: "",
            visitorname: "",
            visitor_mobile_number: "",
            visitor_email: "",
            hostid: "",
            hostname: "",
            loading: false,
            submitted: false,
            validation: this.validator.valid()
        }

        this.getHostList = this.getHostList.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onStepChange = this.onStepChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.selectedVisit) {
            this.setState({
                visitLogStep: VISITLOGSTEPS.STEP2,
                showPopup: props.showPopup,
                _id: props.selectedVisit._id,
                visitorid: props.selectedVisit.visitorid._id,
                visitorname: props.selectedVisit.visitorid.fullname,
                visitor_mobile_number: props.selectedVisit.visitorid.property.mobile_number,
                visitor_email_id: props.selectedVisit.visitorid.property.email,
                hostid: props.selectedVisit.hostid._id,
                hostname: props.selectedVisit.hostid.fullname,
                loading: false,
                submitted: false
            });
        } else {
            this.setState({
                visitLogStep: VISITLOGSTEPS.STEP1,
                showPopup: props.showPopup,
                _id: "",
                visitorid: "",
                visitorname: "",
                visitor_mobile_number: "",
                visitor_email: "",
                hostid: "",
                hostname: "",
                loading: false,
                submitted: false
            });
        }
    }

    getVisitorList = () => {
        VisitorServices.getList().then((response) => {
            this.setState({ visitorList: response.data });
        })
    }

    getHostList = () => {
        HostServices.getList().then((response) => {
            this.setState({ hostList: response.data });
        })
    }

    componentDidMount = async () => {
        this.getVisitorList();
        this.getHostList();
    }

    onChangeValue = (event) => {
        //event.preventDefault();
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onHostDropdownChange = value => {
        const foundHost = this.state.hostList.find(x => x._id === value)
        if (foundHost) {
            this.setState({
                hostid: foundHost._id,
                hostname: foundHost.fullname
            });
        }
    }

    onSave = async () => {
        this.setState({ submitted: true, loading: true })

        let { _id, visitorid, visitorname, visitor_mobile_number, visitor_email, hostid, hostname } = this.state
        const validation = this.validator.validate(this.state);

        if (validation.isValid) {
            // setTimeout(() => {
            //     console.log('AAAAAAAAAA')
            // }, 3000);
            if (visitorid === "") {
                const visitor = {
                    stage: "NEW",
                    status: "active",
                    fullname: visitorname,
                    property: {
                        mobile_number: visitor_mobile_number,
                        email: visitor_email
                    }
                }
                const res = await VisitorServices.save(visitor)
                if (res.status === 200 && !res.data.errors) {
                    visitorid = res.data._id;
                } else {
                    console.log('VISITOR Save ERROR', res.data.errors)
                    return
                }
            }

            const visitLog = {
                _id: _id,
                status: "active",
                visitorid: visitorid,
                hostid: hostid,
                checkout: null
            }
            const res = await VisitLogServices.save(visitLog)
            if (res.status === 200 && !res.data.errors) {
                const visitlog = res.data;
                this.props.onSaveHandle(visitlog)
            } else {
                console.log('VISITLOG Save ERROR', res.data.errors)
                return
            }
        }

        this.setState({ loading: false })
    }

    onStepChange = (step) => {
        if (this.state.visitLogStep === VISITLOGSTEPS.STEP1) {
            const foundVisitor = this.state.visitorList.find(x => x.property.mobile_number === this.state.visitor_mobile_number)
            if (foundVisitor) {
                this.setState({
                    visitorid: foundVisitor._id,
                    visitorname: foundVisitor.fullname,
                    visitLogStep: step,
                    submitted: false
                });

                return
            }
        }
        this.setState({ visitLogStep: step, submitted: false });
    }

    render() {
        const { visitLogStep, showPopup, visitorList, hostList, _id, visitorid, visitorname, visitor_mobile_number, visitor_email, hostid, hostname, loading, submitted } = this.state
        const validation = submitted ? this.validator.validate(this.state) : this.state.validation

        const hostDropdown = hostList.map(host => (
            {
                name: host.property.fullname,
                value: host._id
            }
        ))

        return (
            <>
                <div className={`modal fade ${showPopup === true ? "show" : ""}`} style={{ display: showPopup === true ? "block" : "none" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {visitLogStep === VISITLOGSTEPS.STEP1 ? "Enter Visitor Mobile Number"
                                        :
                                        this.props.selectedVisit ? "Edit Visit" : "Web Check In"}
                                </h5>
                                <button type="button" className="close" onClick={this.props.onCloseHandle}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container mt-3" >
                                    {visitLogStep === VISITLOGSTEPS.STEP1 ?
                                        <TextInput
                                            labelText="Mobile Number"
                                            required={true}
                                            name="visitor_mobile_number"
                                            value={visitor_mobile_number}
                                            placeholder="Enter Mobile Number"
                                            onChangeCallBack={this.onChangeValue}
                                            validationMessage={validation.visitor_mobile_number.message}
                                        />
                                        :
                                        <>
                                            <TextInput
                                                labelText="Visitor Name"
                                                required={true}
                                                name="visitorname"
                                                value={visitorname}
                                                placeholder="Enter Visitor Name"
                                                onChangeCallBack={this.onChangeValue}
                                                validationMessage={validation.visitorname.message}
                                            />
                                            <TextInput
                                                labelText="Mobile Number"
                                                required={true}
                                                name="visitor_mobile_number"
                                                value={visitor_mobile_number}
                                                placeholder="Enter Mobile Number"
                                                onChangeCallBack={this.onChangeValue}
                                                validationMessage={validation.visitor_mobile_number.message}
                                            />
                                            <TextInput
                                                labelText="Email"
                                                name="visitor_email"
                                                value={visitor_email}
                                                placeholder="Enter Email"
                                                onChangeCallBack={this.onChangeValue}
                                            />
                                            <div className="form-group row">
                                                <label htmlFor="host" className="col-sm-4 col-form-label">Host<span style={{ color: 'red' }}>*</span></label>
                                                <div className="col-sm-8">
                                                    <SelectSearch
                                                        options={hostDropdown}
                                                        name="hostname"
                                                        value={hostid}
                                                        search
                                                        placeholder="Select Host"
                                                        onChange={this.onHostDropdownChange}
                                                    />

                                                    <span className="help-block">{validation.hostname.message}</span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.props.onCloseHandle}>Cancel</button>
                                {visitLogStep === VISITLOGSTEPS.STEP1 ?
                                    <>
                                        <button type="button" className="btn btn-primary" onClick={() => this.onStepChange(VISITLOGSTEPS.STEP2)}>Countinue</button>
                                    </>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={this.onSave} disabled={loading}>
                                        {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Save Changes</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default VisitLogEntryPopup;
