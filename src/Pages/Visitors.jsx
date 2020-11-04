import React, { Component } from 'react'
import moment from 'moment'
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Inject, Sort, Page, Resize, Reorder, Filter } from '@syncfusion/ej2-react-grids';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Image from '../Components/Image'

import { DATAACTIONS } from '../Helpers/CommonEnums'
import * as VisitorServices from '../Api/VisitorServices'
import VisitorEntryPopup from './VisitorEntryPopup'


class Visitors extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showPopup: false,
            visitorList: [],
            selectedVisitor: null,
            searchText: null,
            selectedrows: []
        }

        this.gridInstance = null

        this.filterSettings = { type: 'Excel' };
        this.customAttributes = { class: 'customcss' }

        this.onSearch = this.onSearch.bind(this);
        this.onRowSelectionChanged = this.onRowSelectionChanged.bind(this);
        this.onDataAction = this.onDataAction.bind(this);
        this.onCloseHandle = this.onCloseHandle.bind(this);
        this.onSaveHandle = this.onSaveHandle.bind(this);
    }

    getVisitorList = () => {
        this.setState({ loading: true });
        VisitorServices.getList().then((response) => {
            this.setState({ visitorList: response.data, loading: false });
        })
    }

    componentDidMount() {
        this.getVisitorList()
    }

    onDataAction = async (action) => {

        switch (action) {
            case DATAACTIONS.ADDNEW:
                this.setState({ showPopup: true, selectedVisitor: null })
                break;
            case DATAACTIONS.EDIT:
                if (this.state.selectedrows.length > 0) {
                    const selectedVisitor = this.gridInstance.getSelectedRecords()[0]
                    this.setState({ showPopup: true, selectedVisitor: selectedVisitor })
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

    onSaveHandle = () => {
        this.setState({ showPopup: false })
        this.getVisitorList()
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

    render() {
        const { loading, showPopup, visitorList, selectedVisitor, searchText, selectedrows } = this.state;

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
                                        <h3>Visitor List</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <input className="form-control mb-2" type="search" onChange={(e) => this.onSearch(e)} placeholder="Search Bills" aria-label="Search" />
                                    </div>
                                </div>
                            </div>
                            <div className="white-box p-2 mt-2 mb-2 ">
                                <button className="dt-button" onClick={() => this.onDataAction(DATAACTIONS.ADDNEW)}><span>New</span></button>
                                <button className={`dt-button ${selectedrows.length === 0 ? "disabled" : ""}`} onClick={() => this.onDataAction(DATAACTIONS.EDIT)} > <span>Edit</span></button>
                                <button className={`dt-button ${selectedrows.length === 0 ? "disabled" : ""}`}><span>Delete</span></button>

                                <VisitorEntryPopup showPopup={showPopup} selectedVisitor={selectedVisitor} onCloseHandle={this.onCloseHandle} onSaveHandle={this.onSaveHandle} ></VisitorEntryPopup>

                                <GridComponent
                                    dataSource={visitorList}
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
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective headerText="Name" field='fullname' width='150' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Mobile No" field='property.mobile_number' width='100' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Email" field='property.email' width='150' customAttributes={this.customAttributes} />
                                        <ColumnDirective headerText="Company" field='property.company' width='120' customAttributes={this.customAttributes} />
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


export default Visitors