import React, { Component } from 'react'
import moment from 'moment'
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Inject, Sort, Page, Resize, Reorder, Filter } from '@syncfusion/ej2-react-grids';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Image from '../Components/Image'

import { DATAACTIONS } from '../Helpers/CommonEnums'

import * as VisitLogServices from '../Api/VisitLogServices'
import VisitLogEntryPopup from './VisitLogEntryPopup';

class VisitLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showPopup: false,
            visitLogList: [],
            selectedVisit: null,
            selectedrows: [],
            searchText: null
        }

        this.gridInstance = null

        this.filterSettings = { type: 'Excel' };
        this.customAttributes = { class: 'customcss' }

        this.gridActionTemplate = this.gridActionTemplate.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onRowSelectionChanged = this.onRowSelectionChanged.bind(this);
        this.onDataAction = this.onDataAction.bind(this);
        this.onCloseHandle = this.onCloseHandle.bind(this);
        this.onSaveHandle = this.onSaveHandle.bind(this);
    }

    getVisitLogList = () => {
        this.setState({ loading: true });
        VisitLogServices.getList().then((response) => {
            this.setState({ visitLogList: response.data, loading: false });
            console.log('visitLogList :', response.data)
        })
    }

    componentDidMount() {
        this.getVisitLogList()
    }

    onDataAction = async (action) => {

        switch (action) {
            case DATAACTIONS.ADDNEW:
                this.setState({ showPopup: true, selectedVisit: null })
                break;
            case DATAACTIONS.EDIT:
                if (this.state.selectedrows.length > 0) {
                    const selectedVisit = this.gridInstance.getSelectedRecords()[0]
                    this.setState({ showPopup: true, selectedVisit: selectedVisit })
                }

                break;
            case DATAACTIONS.DELETE:
                //
                break;
            default:
        }
    }

    onCloseHandle = () => {
        this.setState({ showPopup: false })
    }

    onSaveHandle = async (visitLog) => {
        this.setState({ showPopup: false })
        this.getVisitLogList()
    }

    onRowSelectionChanged = () => {
        if (this.gridInstance) {
            /** Get the selected row indexes */
            const selectedrows = this.gridInstance.getSelectedRowIndexes();
            this.setState({ selectedrows: selectedrows })
        }
    }

    onSearch = (event) => {
        if (this.gridInstance) {
            let keyword = event.target.value;
            this.setState({ searchText: keyword })
            this.gridInstance.search(keyword);
        }
    }

    gridActionTemplate = (event) => {
        return (
            <>
                <span><img src={Image.billicon} onClick={() => console.log('gridActionTemplate event:', event)} style={{ cursor: 'pointer' }} /></span>
                <span><img src={Image.billicon} onClick={() => console.log('gridActionTemplate event:', event)} style={{ cursor: 'pointer' }} /></span>
                <span><img src={Image.billicon} onClick={() => console.log('gridActionTemplate event:', event)} style={{ cursor: 'pointer' }} /></span>

                <mat-icon _ngcontent-c21="" className="mousechange button-eyes button-eyes-hover mat-icon notranslate material-icons mat-icon-no-color" mattooltip="View Detail" role="img" aria-hidden="true" aria-describedby="cdk-describedby-message-6" cdk-describedby-host="">visibility</mat-icon>
                <mat-icon _ngcontent-c21="" className="mousechange button-printer button-printer-hover mat-icon notranslate material-icons mat-icon-no-color" mattooltip="Print Badge" role="img" aria-hidden="true" aria-describedby="cdk-describedby-message-7" cdk-describedby-host="">print</mat-icon>
                <mat-icon _ngcontent-c21="" className="mousechange button-del button-del-hover mat-icon notranslate material-icons mat-icon-no-color" mattooltip="Remove" role="img" aria-hidden="true" aria-describedby="cdk-describedby-message-8" cdk-describedby-host="">delete_outline</mat-icon>
                <mat-icon _ngcontent-c21="" className="mousechange button-checkout button-checkout-hover mat-icon notranslate material-icons mat-icon-no-color ng-star-inserted" mattooltip="Checkout User" role="img" aria-hidden="true" aria-describedby="cdk-describedby-message-9" cdk-describedby-host="">exit_to_app</mat-icon>
            </>
        );
    }

    render() {
        const { loading, showPopup, visitLogList, selectedVisit, selectedrows, searchText } = this.state;

        return (
            <>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid">
                            <Backdrop style={{ zIndex: "1000" }} open={loading}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            <div className="white-box p-2 mt-2 mb-2 ">
                                <div className="row">
                                    <div className="col-md-9">
                                        <h3>Visitor Logs</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <input className="form-control mb-2" type="search" onChange={(e) => this.onSearch(e)} placeholder="Search Bills" aria-label="Search" />
                                    </div>
                                </div>
                            </div>
                            <div className="white-box p-2 mt-2 mb-2 ">
                                <button className="dt-button" onClick={() => this.onDataAction(DATAACTIONS.ADDNEW)}><span>Web Check in</span></button>
                                <button className={`dt-button ${selectedrows.length === 0 ? "disabled" : ""}`} onClick={() => this.onDataAction(DATAACTIONS.EDIT)} > <span>Edit</span></button>
                                <button className={`dt-button ${selectedrows.length === 0 ? "disabled" : ""}`}><span>Delete</span></button>

                                <VisitLogEntryPopup showPopup={showPopup} selectedVisit={selectedVisit} onCloseHandle={this.onCloseHandle} onSaveHandle={this.onSaveHandle} ></VisitLogEntryPopup>
                                <GridComponent
                                    dataSource={visitLogList}
                                    rowDeselected={this.onRowSelectionChanged}
                                    rowSelected={this.onRowSelectionChanged}
                                    ref={g => this.gridInstance = g}
                                    allowSorting={true}
                                    allowPaging={true}
                                    pageSettings={{ pageCount: 4, pageSizes: true }}
                                    allowResizing={true}
                                    allowReordering={true}
                                    allowFiltering={true}
                                    filterSettings={this.filterSettings}
                                    allowH
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective headerText="Visitor Name" field='visitorid.fullname' width='150' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Mobile No" field='visitorid.property.mobile_number' width='100' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Company" field='visitorid.property.company' width='120' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Host" field='hostid.fullname' width='150' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="CheckIn" field='checkin' type="date" format={{ type: 'date', format: 'M/d/y' }} type='date' width='130' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="ValidTo" field='validto' format='dd/MM/yyyy HH:mm' type='date' width='130' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="CheckOut" field='checkout' format='dd/MM/yyyy HH:mm' type='date' width='130' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Action" width='60' template={this.gridActionTemplate} customAttributes={this.customAttributes}></ColumnDirective>
                                    </ColumnsDirective>
                                    <Inject services={[Sort, Page, Resize, Reorder, Filter]} />
                                </GridComponent>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}


export default VisitLog 